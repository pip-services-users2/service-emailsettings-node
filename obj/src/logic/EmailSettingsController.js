"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSettingsController = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_6 = require("pip-services3-commons-nodex");
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const client_activities_node_1 = require("client-activities-node");
const client_msgtemplates_node_1 = require("client-msgtemplates-node");
const EmailSettingsActivityTypeV1_1 = require("../data/version1/EmailSettingsActivityTypeV1");
const EmailSettingsCommandSet_1 = require("./EmailSettingsCommandSet");
class EmailSettingsController {
    constructor() {
        this._verifyOnCreate = true;
        this._verifyOnUpdate = true;
        this._expireTimeout = 24 * 60; // in minutes
        this._magicCode = null;
        this._config = new pip_services3_commons_nodex_1.ConfigParams();
        this._dependencyResolver = new pip_services3_commons_nodex_2.DependencyResolver(EmailSettingsController._defaultConfig);
        this._templatesResolver = new client_msgtemplates_node_1.MessageTemplatesResolverV1();
        this._logger = new pip_services3_components_nodex_1.CompositeLogger();
        this._code_length = 9;
    }
    configure(config) {
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
    setReferences(references) {
        this._dependencyResolver.setReferences(references);
        this._templatesResolver.setReferences(references);
        this._logger.setReferences(references);
        this._persistence = this._dependencyResolver.getOneRequired('persistence');
        this._activitiesClient = this._dependencyResolver.getOneOptional('activities');
        this._emailClient = this._dependencyResolver.getOneOptional('emaildelivery');
    }
    getCommandSet() {
        if (this._commandSet == null)
            this._commandSet = new EmailSettingsCommandSet_1.EmailSettingsCommandSet(this);
        return this._commandSet;
    }
    settingsToPublic(settings) {
        if (settings == null)
            return null;
        delete settings.ver_code;
        delete settings.ver_expire_time;
        return settings;
    }
    getSettingsByIds(correlationId, recipientIds) {
        return __awaiter(this, void 0, void 0, function* () {
            let settings = yield this._persistence.getListByIds(correlationId, recipientIds);
            if (settings)
                settings = settings.map(s => this.settingsToPublic(s));
            return settings;
        });
    }
    getSettingsById(correlationId, recipientId) {
        return __awaiter(this, void 0, void 0, function* () {
            let settings = yield this._persistence.getOneById(correlationId, recipientId);
            return this.settingsToPublic(settings);
        });
    }
    getSettingsByEmail(correlationId, email) {
        return __awaiter(this, void 0, void 0, function* () {
            let settings = yield this._persistence.getOneByEmail(correlationId, email);
            return this.settingsToPublic(settings);
        });
    }
    verifyAndSaveSettings(correlationId, oldSettings, newSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            let verify = false;
            // Check if verification is needed
            verify = (oldSettings == null && this._verifyOnCreate)
                || (oldSettings.email != newSettings.email && this._verifyOnUpdate);
            if (verify) {
                newSettings.verified = false;
                newSettings.ver_code = pip_services3_commons_nodex_6.IdGenerator.nextShort().substr(0, this._code_length);
                newSettings.ver_expire_time = new Date(new Date().getTime() + this._expireTimeout * 60000);
            }
            // Set new settings
            newSettings = yield this._persistence.set(correlationId, newSettings);
            // Send verification if needed
            if (verify)
                // Send verification message and do not wait
                this.sendVerificationMessage(correlationId, newSettings);
            return newSettings;
        });
    }
    sendVerificationMessage(correlationId, newSettings) {
        return __awaiter(this, void 0, void 0, function* () {
            let template;
            let err;
            try {
                template = yield this._templatesResolver.resolve('verify_email');
            }
            catch (e) {
                err = e;
            }
            if (err == null && template == null) {
                err = new pip_services3_commons_nodex_4.ConfigException(correlationId, 'MISSING_VERIFY_EMAIL', 'Message template "verify_email" is missing');
            }
            if (err) {
                this._logger.error(correlationId, err, 'Cannot find verify_email message template');
                return;
            }
            let message = {
                subject: template.subject,
                text: template.text,
                html: template.html
            };
            let recipient = {
                id: newSettings.id,
                name: newSettings.name,
                email: newSettings.email,
                language: newSettings.language
            };
            let parameters = pip_services3_commons_nodex_1.ConfigParams.fromTuples('code', newSettings.ver_code, 'email', newSettings.email);
            if (this._emailClient) {
                try {
                    yield this._emailClient.sendMessageToRecipient(correlationId, recipient, message, parameters);
                }
                catch (err) {
                    this._logger.error(correlationId, err, 'Failed to send email verification message');
                }
            }
        });
    }
    setSettings(correlationId, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (settings.id == null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id');
            }
            if (settings.email == null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_EMAIL', 'Missing email');
            }
            if (!EmailSettingsController._emailRegex.test(settings.email)) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'WRONG_EMAIL', 'Invalid email ' + settings.email).withDetails('email', settings.email);
            }
            let newSettings = Object.assign({}, settings);
            newSettings.verified = false;
            newSettings.ver_code = null;
            newSettings.ver_expire_time = null;
            newSettings.subscriptions = newSettings.subscriptions || {};
            let oldSettings;
            // Get existing settings
            oldSettings = yield this._persistence.getOneById(correlationId, newSettings.id);
            if (oldSettings != null) {
                // Override
                newSettings.verified = oldSettings.verified;
                newSettings.ver_code = oldSettings.ver_code;
                newSettings.ver_expire_time = oldSettings.ver_expire_time;
            }
            // Verify and save settings
            newSettings = yield this.verifyAndSaveSettings(correlationId, oldSettings, newSettings);
            return newSettings;
        });
    }
    setVerifiedSettings(correlationId, settings) {
        return __awaiter(this, void 0, void 0, function* () {
            if (settings.id == null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id');
            }
            if (settings.email == null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_EMAIL', 'Missing email');
            }
            if (!EmailSettingsController._emailRegex.test(settings.email)) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'WRONG_EMAIL', 'Invalid email ' + settings.email).withDetails('email', settings.email);
            }
            let newSettings = Object.assign({}, settings);
            newSettings.verified = true;
            newSettings.ver_code = null;
            newSettings.ver_expire_time = null;
            newSettings.subscriptions = newSettings.subscriptions || {};
            return yield this._persistence.set(correlationId, newSettings);
        });
    }
    setRecipient(correlationId, recipientId, name, email, language) {
        return __awaiter(this, void 0, void 0, function* () {
            if (recipientId == null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id');
            }
            if (email != null && !EmailSettingsController._emailRegex.test(email)) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'WRONG_EMAIL', 'Invalid email ' + email).withDetails('email', email);
            }
            let oldSettings;
            let newSettings;
            // Get existing settings
            oldSettings = yield this._persistence.getOneById(correlationId, recipientId);
            if (oldSettings != null) {
                // Copy and modify existing settings
                newSettings = Object.assign({}, oldSettings);
                newSettings.name = name || oldSettings.name;
                newSettings.email = email || oldSettings.email;
                newSettings.language = language || oldSettings.language;
            }
            else {
                // Create new settings if they are not exist
                oldSettings = null;
                newSettings = {
                    id: recipientId,
                    name: name,
                    email: email,
                    language: language
                };
            }
            // Verify and save settings
            newSettings = yield this.verifyAndSaveSettings(correlationId, oldSettings, newSettings);
            return newSettings;
        });
    }
    setSubscriptions(correlationId, recipientId, subscriptions) {
        return __awaiter(this, void 0, void 0, function* () {
            if (recipientId == null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_ID', 'Missing id');
            }
            let oldSettings;
            let newSettings;
            // Get existing settings
            oldSettings = yield this._persistence.getOneById(correlationId, recipientId);
            if (oldSettings != null) {
                // Copy and modify existing settings
                newSettings = Object.assign({}, oldSettings);
                newSettings.subscriptions = subscriptions || oldSettings.subscriptions;
            }
            else {
                // Create new settings if they are not exist
                oldSettings = null;
                newSettings = {
                    id: recipientId,
                    name: null,
                    email: null,
                    language: null,
                    subscriptions: subscriptions
                };
            }
            // Verify and save settings
            newSettings = yield this.verifyAndSaveSettings(correlationId, oldSettings, newSettings);
            return newSettings;
        });
    }
    deleteSettingsById(correlationId, recipientId) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this._persistence.deleteById(correlationId, recipientId);
        });
    }
    resendVerification(correlationId, recipientId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (recipientId == null) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'NO_RECIPIENT_ID', 'Missing recipient id');
            }
            let settings;
            // Get existing settings
            settings = yield this._persistence.getOneById(correlationId, recipientId);
            if (settings == null) {
                throw new pip_services3_commons_nodex_5.NotFoundException(correlationId, 'RECIPIENT_NOT_FOUND', 'Recipient ' + recipientId + ' was not found')
                    .withDetails('recipient_id', recipientId);
            }
            // Check if verification is needed
            settings.verified = false;
            settings.ver_code = pip_services3_commons_nodex_6.IdGenerator.nextShort().substr(0, this._code_length);
            settings.ver_expire_time = new Date(new Date().getTime() + this._expireTimeout * 60000);
            // Set new settings
            settings = yield this._persistence.set(correlationId, settings);
            // Send verification
            // Send verification message and do not wait
            this.sendVerificationMessage(correlationId, settings);
        });
    }
    logActivity(correlationId, settings, activityType) {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._activitiesClient) {
                try {
                    this._activitiesClient.logPartyActivity(correlationId, new client_activities_node_1.PartyActivityV1(null, activityType, {
                        id: settings.id,
                        type: 'account',
                        name: settings.name
                    }));
                }
                catch (err) {
                    this._logger.error(correlationId, err, 'Failed to log user activity');
                }
            }
        });
    }
    verifyEmail(correlationId, recipientId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            let settings;
            // Read settings
            settings = yield this._persistence.getOneById(correlationId, recipientId);
            if (settings == null) {
                throw new pip_services3_commons_nodex_5.NotFoundException(correlationId, 'RECIPIENT_NOT_FOUND', 'Recipient ' + recipientId + ' was not found')
                    .withDetails('recipient_id', recipientId);
            }
            // Check and update verification code
            let verified = settings.ver_code == code;
            verified = verified || (this._magicCode != null && code == this._magicCode);
            verified = verified && new Date().getTime() < new Date(settings.ver_expire_time).getTime();
            if (!verified) {
                throw new pip_services3_commons_nodex_3.BadRequestException(correlationId, 'INVALID_CODE', 'Invalid email verification code ' + code)
                    .withDetails('recipient_id', recipientId)
                    .withDetails('code', code);
            }
            settings.verified = true;
            settings.ver_code = null;
            settings.ver_expire_time = null;
            // Save user
            yield this._persistence.set(correlationId, settings);
            // Asynchronous post-processing
            yield this.logActivity(correlationId, settings, EmailSettingsActivityTypeV1_1.EmailSettingsActivityTypeV1.EmailVerified);
        });
    }
}
exports.EmailSettingsController = EmailSettingsController;
EmailSettingsController._emailRegex = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
EmailSettingsController._defaultConfig = pip_services3_commons_nodex_1.ConfigParams.fromTuples('dependencies.persistence', 'service-emailsettings:persistence:*:*:1.0', 'dependencies.activities', 'service-activities:client:*:*:1.0', 'dependencies.msgtemplates', 'service-msgtemplates:client:*:*:1.0', 'dependencies.emaildelivery', 'service-email:client:*:*:1.0', 'message_templates.verify_email.subject', 'Verify email', 'message_templates.verify_email.text', 'Verification code for {{email}} is {{ code }}.', 'options.magic_code', null, 'options.signature_length', 100, 'options.verify_on_create', true, 'options.verify_on_update', true, 'options.code_length', 9 // verification code length (3-9, default 9)
);
//# sourceMappingURL=EmailSettingsController.js.map