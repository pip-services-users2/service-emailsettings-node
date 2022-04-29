import { ConfigParams } from 'pip-services3-commons-nodex';
import { IConfigurable } from 'pip-services3-commons-nodex';
import { IReferences } from 'pip-services3-commons-nodex';
import { IReferenceable } from 'pip-services3-commons-nodex';
import { DependencyResolver } from 'pip-services3-commons-nodex';
import { ICommandable } from 'pip-services3-commons-nodex';
import { CommandSet } from 'pip-services3-commons-nodex';
import { BadRequestException } from 'pip-services3-commons-nodex';
import { ConfigException } from 'pip-services3-commons-nodex';
import { NotFoundException } from 'pip-services3-commons-nodex';
import { IdGenerator } from 'pip-services3-commons-nodex';
import { CompositeLogger } from 'pip-services3-components-nodex';

import { PartyActivityV1 } from 'client-activities-node';
import { IActivitiesClientV1 } from 'client-activities-node';
import { MessageTemplatesResolverV1, MessageTemplateV1 } from 'client-msgtemplates-node';
import { EmailMessageV1 } from 'client-email-node';
import { EmailRecipientV1 } from 'client-email-node';
import { IEmailClientV1 } from 'client-email-node';

import { EmailSettingsV1 } from '../data/version1/EmailSettingsV1';
import { EmailSettingsActivityTypeV1 } from '../data/version1/EmailSettingsActivityTypeV1';
import { IEmailSettingsPersistence } from '../persistence/IEmailSettingsPersistence';
import { IEmailSettingsController } from './IEmailSettingsController';
import { EmailSettingsCommandSet } from './EmailSettingsCommandSet';

export class EmailSettingsController implements IConfigurable, IReferenceable, ICommandable, IEmailSettingsController {
    private static _emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    private static _defaultConfig: ConfigParams = ConfigParams.fromTuples(
        'dependencies.persistence', 'service-emailsettings:persistence:*:*:1.0',
        'dependencies.activities', 'service-activities:client:*:*:1.0',
        'dependencies.msgtemplates', 'service-msgtemplates:client:*:*:1.0',
        'dependencies.emaildelivery', 'service-email:client:*:*:1.0',
        
        'message_templates.verify_email.subject', 'Verify email',
        'message_templates.verify_email.text', 'Verification code for {{email}} is {{ code }}.',

        'options.magic_code', null,
        'options.signature_length', 100,
        'options.verify_on_create', true,
        'options.verify_on_update', true,
        'options.code_length', 9 // verification code length (3-9, default 9)

    );

    private _verifyOnCreate: boolean = true;
    private _verifyOnUpdate: boolean = true;
    private _expireTimeout: number = 24 * 60; // in minutes
    private _magicCode: string = null;
    private _config: ConfigParams = new ConfigParams();

    private _dependencyResolver: DependencyResolver = new DependencyResolver(EmailSettingsController._defaultConfig);
    private _templatesResolver: MessageTemplatesResolverV1 = new MessageTemplatesResolverV1();
    private _logger: CompositeLogger = new CompositeLogger();
    private _activitiesClient: IActivitiesClientV1;
    private _emailClient: IEmailClientV1;
    private _persistence: IEmailSettingsPersistence;
    private _commandSet: EmailSettingsCommandSet;
    private _code_length: number = 9;

    public configure(config: ConfigParams): void {
        config = config.setDefaults(EmailSettingsController._defaultConfig);

        this._dependencyResolver.configure(config);
        this._templatesResolver.configure(config);
        this._logger.configure(config);

        this._verifyOnCreate = config.getAsBooleanWithDefault('options.verify_on_create', this._verifyOnCreate);
        this._verifyOnUpdate = config.getAsBooleanWithDefault('options.verify_on_update', this._verifyOnUpdate);
        this._expireTimeout = config.getAsIntegerWithDefault('options.verify_expire_timeout', this._expireTimeout);
        this._magicCode = config.getAsStringWithDefault('options.magic_code', this._magicCode);
        this._code_length = config.getAsIntegerWithDefault('options.code_length', this._code_length);
        this._code_length = this._code_length <= 9 ? this._code_length : 9;
        this._code_length = this._code_length >= 3 ? this._code_length : 3;

        
        this._config = config;
    }

    public setReferences(references: IReferences): void {
        this._dependencyResolver.setReferences(references);
        this._templatesResolver.setReferences(references);
        this._logger.setReferences(references);

        this._persistence = this._dependencyResolver.getOneRequired<IEmailSettingsPersistence>('persistence');
        this._activitiesClient = this._dependencyResolver.getOneOptional<IActivitiesClientV1>('activities');
        this._emailClient = this._dependencyResolver.getOneOptional<IEmailClientV1>('emaildelivery');
    }

    public getCommandSet(): CommandSet {
        if (this._commandSet == null)
            this._commandSet = new EmailSettingsCommandSet(this);
        return this._commandSet;
    }
    
    private settingsToPublic(settings: EmailSettingsV1): EmailSettingsV1 {
        if (settings == null) return null;
        delete settings.ver_code;
        delete settings.ver_expire_time;
        return settings;
    }
    
    public async getSettingsByIds(correlationId: string, recipientIds: string[]): Promise<EmailSettingsV1[]> {
        let settings = await this._persistence.getListByIds(correlationId, recipientIds);

        if (settings)
            settings = settings.map(s => this.settingsToPublic(s));
        
        return settings;
    }
    
    public async getSettingsById(correlationId: string, recipientId: string): Promise<EmailSettingsV1> {
        let settings = await this._persistence.getOneById(correlationId, recipientId);

        return this.settingsToPublic(settings);
    }

    public async getSettingsByEmail(correlationId: string, email: string): Promise<EmailSettingsV1> {
        let settings = await this._persistence.getOneByEmail(correlationId, email);

        return this.settingsToPublic(settings);
    }

    private async verifyAndSaveSettings(correlationId: string,
        oldSettings: EmailSettingsV1, newSettings: EmailSettingsV1): Promise<EmailSettingsV1> {

        let verify = false;

        // Check if verification is needed

        verify = (oldSettings == null && this._verifyOnCreate)
            || (oldSettings.email != newSettings.email && this._verifyOnUpdate);
        if (verify) {
            newSettings.verified = false;
            newSettings.ver_code = IdGenerator.nextShort().substr(0, this._code_length);
            newSettings.ver_expire_time = new Date(new Date().getTime() + this._expireTimeout * 60000);
        }

        // Set new settings
        newSettings = await this._persistence.set(correlationId, newSettings)

        // Send verification if needed
        if (verify)
            // Send verification message and do not wait
            this.sendVerificationMessage(correlationId, newSettings);

        return newSettings;
    }

    private async sendVerificationMessage(correlationId: string, newSettings: EmailSettingsV1): Promise<void> {
        let template: MessageTemplateV1;
        let err: Error;

        try {
            template = await this._templatesResolver.resolve('verify_email');
        } catch(e) {
            err = e;
        }
        
        if (err == null && template == null) {
            err = new ConfigException(
                correlationId,
                'MISSING_VERIFY_EMAIL',
                'Message template "verify_email" is missing'
            );
        }

        if (err) {
            this._logger.error(correlationId, err, 'Cannot find verify_email message template');
            return;
        }

        let message = <EmailMessageV1>{
            subject: template.subject,
            text: template.text,
            html: template.html
        };

        let recipient = <EmailRecipientV1>{
            id: newSettings.id,
            name: newSettings.name,
            email: newSettings.email,
            language: newSettings.language
        };

        let parameters = ConfigParams.fromTuples(
            'code', newSettings.ver_code,
            'email', newSettings.email
        );    

        if (this._emailClient) {
            try {
                await this._emailClient.sendMessageToRecipient(correlationId, recipient, message, parameters);
            } catch (err) {
                this._logger.error(correlationId, err, 'Failed to send email verification message');
            }
        }
    }
    
    public async setSettings(correlationId: string, settings: EmailSettingsV1): Promise<EmailSettingsV1> {
        if (settings.id == null) {
            throw new BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id')
        }
        
        if (settings.email == null) {
            throw new BadRequestException(correlationId, 'NO_EMAIL', 'Missing email')
        }
        
        if (!EmailSettingsController._emailRegex.test(settings.email)) {
            throw new BadRequestException(
                correlationId,
                'WRONG_EMAIL',
                'Invalid email ' + settings.email
            ).withDetails('email', settings.email);
        }
    
        let newSettings: EmailSettingsV1 = Object.assign({}, settings);
        newSettings.verified = false;
        newSettings.ver_code = null;
        newSettings.ver_expire_time = null;
        newSettings.subscriptions = newSettings.subscriptions || {};

        let oldSettings: EmailSettingsV1;

        // Get existing settings
        oldSettings = await this._persistence.getOneById(correlationId, newSettings.id);

        if (oldSettings != null) {
            // Override
            newSettings.verified = oldSettings.verified;
            newSettings.ver_code = oldSettings.ver_code;
            newSettings.ver_expire_time = oldSettings.ver_expire_time;
        }

        // Verify and save settings
        newSettings = await this.verifyAndSaveSettings(correlationId, oldSettings, newSettings);
        
        return newSettings;
    }


    public async setVerifiedSettings(correlationId: string, settings: EmailSettingsV1): Promise<EmailSettingsV1> {
        if (settings.id == null) {
            throw new BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id')
        }
        if (settings.email == null) {
            throw new BadRequestException(correlationId, 'NO_EMAIL', 'Missing email')
        }
        if (!EmailSettingsController._emailRegex.test(settings.email)) {
            throw new BadRequestException(
                correlationId,
                'WRONG_EMAIL',
                'Invalid email ' + settings.email
            ).withDetails('email', settings.email);
        }
    
        let newSettings: EmailSettingsV1 = Object.assign({}, settings);
        newSettings.verified = true;
        newSettings.ver_code = null;
        newSettings.ver_expire_time = null;
        newSettings.subscriptions = newSettings.subscriptions || {};

        return await this._persistence.set(correlationId, newSettings);
    }
    

    public async setRecipient(correlationId: string, recipientId: string,
        name: string, email: string, language: string): Promise<EmailSettingsV1> {

        if (recipientId == null) {
            throw new BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id')
        }
        if (email != null && !EmailSettingsController._emailRegex.test(email)) {
            throw new BadRequestException(
                correlationId,
                'WRONG_EMAIL',
                'Invalid email ' + email
            ).withDetails('email', email);
        }
    
        let oldSettings: EmailSettingsV1;
        let newSettings: EmailSettingsV1;

        // Get existing settings
        oldSettings = await this._persistence.getOneById(correlationId, recipientId);

        if (oldSettings != null) {
            // Copy and modify existing settings
            newSettings = Object.assign({}, oldSettings);
            newSettings.name = name || oldSettings.name;
            newSettings.email = email || oldSettings.email;
            newSettings.language = language || oldSettings.language;
        } else {
            // Create new settings if they are not exist
            oldSettings = null;
            newSettings = <EmailSettingsV1>{
                id: recipientId,
                name: name,
                email: email,
                language: language
            };
        }

        // Verify and save settings
        newSettings = await this.verifyAndSaveSettings(correlationId, oldSettings, newSettings)
        return newSettings;
    }

    public async setSubscriptions(correlationId: string, recipientId: string, subscriptions: any): Promise<EmailSettingsV1> {

        if (recipientId == null) {
            throw new BadRequestException(correlationId, 'NO_ID', 'Missing id')
        }
    
        let oldSettings: EmailSettingsV1;
        let newSettings: EmailSettingsV1;

        // Get existing settings
        oldSettings = await this._persistence.getOneById(correlationId, recipientId);

        if (oldSettings != null) {
            // Copy and modify existing settings
            newSettings = Object.assign({}, oldSettings);
            newSettings.subscriptions = subscriptions || oldSettings.subscriptions;
        } else {
            // Create new settings if they are not exist
            oldSettings = null;
            newSettings = <EmailSettingsV1>{
                id: recipientId,
                name: null,
                email: null,
                language: null,
                subscriptions: subscriptions
            };
        }

        // Verify and save settings
        newSettings = await this.verifyAndSaveSettings(correlationId, oldSettings, newSettings)
        return newSettings;
    }

    public async deleteSettingsById(correlationId: string, recipientId: string): Promise<void> {
        await this._persistence.deleteById(correlationId, recipientId);
    }

    public async resendVerification(correlationId: string, recipientId: string): Promise<void> {

        if (recipientId == null) {
            throw new BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id');
        }
    
        let settings: EmailSettingsV1;

        // Get existing settings
        settings = await this._persistence.getOneById(correlationId, recipientId);

        if (settings == null) {
            throw new NotFoundException(
                correlationId,
                'RECIPIENT_NOT_FOUND',
                'Recipient ' + recipientId + ' was not found'
            )
                .withDetails('recipient_id', recipientId);
        }

        // Check if verification is needed
        settings.verified = false;
        settings.ver_code = IdGenerator.nextShort().substr(0, this._code_length);
        settings.ver_expire_time = new Date(new Date().getTime() + this._expireTimeout * 60000);


        // Set new settings
        settings = await this._persistence.set(correlationId, settings)

        // Send verification
        // Send verification message and do not wait
        this.sendVerificationMessage(correlationId, settings);
    }

    private async logActivity(correlationId: string, settings: EmailSettingsV1, activityType: string): Promise<void> {
        if (this._activitiesClient) {
            try {
                this._activitiesClient.logPartyActivity(
                    correlationId,
                    new PartyActivityV1(
                        null,
                        activityType,
                        {
                            id: settings.id,
                            type: 'account',
                            name: settings.name
                        }
                    )
                );
            } catch (err) {
                this._logger.error(correlationId, err, 'Failed to log user activity');
            }
        }
    }
    
    public async verifyEmail(correlationId: string, recipientId: string, code: string): Promise<void> {
        let settings: EmailSettingsV1;

        // Read settings
        settings = await this._persistence.getOneById(correlationId, recipientId);

        if (settings == null) {
            throw new NotFoundException(
                correlationId,
                'RECIPIENT_NOT_FOUND',
                'Recipient ' + recipientId + ' was not found'
            )
                .withDetails('recipient_id', recipientId);
        }

        // Check and update verification code
        let verified = settings.ver_code == code;
        verified = verified || (this._magicCode != null && code == this._magicCode);
        verified = verified && new Date().getTime() < new Date(settings.ver_expire_time).getTime();

        if (!verified) {
            throw new BadRequestException(
                correlationId,
                'INVALID_CODE',
                'Invalid email verification code ' + code
            )
                .withDetails('recipient_id', recipientId)
                .withDetails('code', code);
        }

        settings.verified = true;
        settings.ver_code = null;
        settings.ver_expire_time = null;


        // Save user
        await this._persistence.set(
            correlationId,
            settings
        );

        // Asynchronous post-processing
        await this.logActivity(
            correlationId,
            settings,
            EmailSettingsActivityTypeV1.EmailVerified
        );
    }
}
