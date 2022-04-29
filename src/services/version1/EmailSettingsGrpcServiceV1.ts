const services = require('../../../../src/protos/emailsettings_v1_grpc_pb');
const messages = require('../../../../src/protos/emailsettings_v1_pb');

import { IReferences } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { GrpcService } from 'pip-services3-grpc-nodex';

import { IEmailSettingsController } from '../../logic/IEmailSettingsController';
import { EmailSettingsGrpcConverterV1 } from './EmailSettingsGrpcConverterV1';

export class EmailSettingsGrpcServiceV1 extends GrpcService {
    private _controller: IEmailSettingsController;
	
    public constructor() {
        super(services.EmailSettingsxService);
        this._dependencyResolver.put('controller', new Descriptor("service-emailsettings", "controller", "default", "*", "*"));
    }

	public setReferences(references: IReferences): void {
		super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired<IEmailSettingsController>('controller');
    }
    
    private async getSettingsByIds(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let recipientIds = call.request.getRecipientIdsList();

        let response = new messages.EmailSettingsListReply();

        try {
            let result = await this._controller.getSettingsByIds(correlationId, recipientIds);
            let settings = EmailSettingsGrpcConverterV1.fromEmailSettingsList(result);
            response.setSettingsList(settings);
        } catch (err) {
            let error = EmailSettingsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async getSettingsById(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let recipientId = call.request.getRecipientId();

        let response = new messages.EmailSettingsObjectReply();

        try {
            let result = await this._controller.getSettingsById(correlationId, recipientId);
            let settings = EmailSettingsGrpcConverterV1.fromEmailSettings(result);
            response.setSettings(settings);
        } catch (err) {
            let error = EmailSettingsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async getSettingsByEmail(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let email = call.request.getEmail();

        let response = new messages.EmailSettingsObjectReply();
        try {
            let result = await this._controller.getSettingsByEmail(correlationId, email);
            let grpcEmailObj = EmailSettingsGrpcConverterV1.fromEmailSettings(result);
            response.setSettings(grpcEmailObj);
        } catch (err) {
            let error = EmailSettingsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }
    
    private async setSettings(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let settings = EmailSettingsGrpcConverterV1.toEmailSettings(call.request.getSettings());

        let response = new messages.EmailSettingsObjectReply();
        try {
            let result = await this._controller.setSettings(correlationId, settings);
            let grpcSettingsObj = EmailSettingsGrpcConverterV1.fromEmailSettings(result);
            response.setSettings(grpcSettingsObj);
        } catch (err) {
            let error = EmailSettingsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async setVerifiedSettings(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let settings = EmailSettingsGrpcConverterV1.toEmailSettings(call.request.getSettings());
        
        let response = new messages.EmailSettingsObjectReply();

        try {
            let result = await this._controller.setVerifiedSettings(correlationId, settings)
            let grpcSettingsObj = EmailSettingsGrpcConverterV1.fromEmailSettings(result);
            response.setSettings(grpcSettingsObj);
        } catch (err) {
            let error = EmailSettingsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async setRecipient(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let recipientId = call.request.getRecipientId();
        let name = call.request.getName();
        let email = call.request.getEmail();
        let language = call.request.getLanguage();

        let response = new messages.EmailSettingsObjectReply();

        try {
            let result = await this._controller.setRecipient(correlationId, recipientId, name, email, language);
            let grpcSettingsObj = EmailSettingsGrpcConverterV1.fromEmailSettings(result);
            response.setSettings(grpcSettingsObj);
        } catch (err) {
            let error = EmailSettingsGrpcConverterV1.fromError(err);
            response.setError(error);
        }
        
        return response;
    }

    private async setSubscriptions(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let recipientId = call.request.getRecipientId();
        let subscriptions = EmailSettingsGrpcConverterV1.fromJson(call.request.getName());

        let response = new messages.EmailSettingsObjectReply();
        try {
            let result = await this._controller.setSubscriptions(correlationId, recipientId, subscriptions);
            let grpcSettingsObj = EmailSettingsGrpcConverterV1.fromEmailSettings(result);
            response.setSettings(grpcSettingsObj);
        } catch (err) {
            let error = EmailSettingsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }

    private async deleteSettingsById(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let recipientId = call.request.getRecipientId();

        let response = new messages.EmailSettingsEmptyReply();
        try {
            await this._controller.deleteSettingsById(correlationId, recipientId);
        } catch (err) {
            let error = EmailSettingsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }    

    private async resendVerification(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let recipientId = call.request.getRecipientId();

        let response = new messages.EmailSettingsEmptyReply();
        try {
            await this._controller.resendVerification(correlationId, recipientId);
        } catch (err) {
            let error = EmailSettingsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }    

    private async verifyEmail(call: any): Promise<any> {
        let correlationId = call.request.getCorrelationId();
        let recipientId = call.request.getRecipientId();
        let code = call.request.getCode();

        let response = new messages.EmailSettingsEmptyReply();
        try {
            await this._controller.verifyEmail(correlationId, recipientId, code);
        } catch (err) {
            let error = EmailSettingsGrpcConverterV1.fromError(err);
            response.setError(error);
        }

        return response;
    }    
    
    public register() {
        this.registerMethod(
            'get_settings_by_ids', 
            null,
            this.getSettingsByIds
        );

        this.registerMethod(
            'get_settings_by_id', 
            null,
            this.getSettingsById
        );

        this.registerMethod(
            'get_settings_by_email', 
            null,
            this.getSettingsByEmail
        );

        this.registerMethod(
            'set_settings', 
            null,
            this.setSettings
        );

        this.registerMethod(
            'set_verified_settings', 
            null,
            this.setVerifiedSettings
        );

        this.registerMethod(
            'set_recipient', 
            null,
            this.setRecipient
        );

        this.registerMethod(
            'set_subscriptions', 
            null,
            this.setSubscriptions
        );

        this.registerMethod(
            'delete_settings_by_id',
            null, 
            this.deleteSettingsById
        );

        this.registerMethod(
            'resend_verification',
            null, 
            this.resendVerification
        );

        this.registerMethod(
            'verify_email',
            null, 
            this.verifyEmail
        );

    }
}
