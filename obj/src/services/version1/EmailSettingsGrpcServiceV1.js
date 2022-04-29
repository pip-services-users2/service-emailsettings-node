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
exports.EmailSettingsGrpcServiceV1 = void 0;
const services = require('../../../../src/protos/emailsettings_v1_grpc_pb');
const messages = require('../../../../src/protos/emailsettings_v1_pb');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
const EmailSettingsGrpcConverterV1_1 = require("./EmailSettingsGrpcConverterV1");
class EmailSettingsGrpcServiceV1 extends pip_services3_grpc_nodex_1.GrpcService {
    constructor() {
        super(services.EmailSettingsxService);
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor("service-emailsettings", "controller", "default", "*", "*"));
    }
    setReferences(references) {
        super.setReferences(references);
        this._controller = this._dependencyResolver.getOneRequired('controller');
    }
    getSettingsByIds(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let recipientIds = call.request.getRecipientIdsList();
            let response = new messages.EmailSettingsListReply();
            try {
                let result = yield this._controller.getSettingsByIds(correlationId, recipientIds);
                let settings = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromEmailSettingsList(result);
                response.setSettingsList(settings);
            }
            catch (err) {
                let error = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    getSettingsById(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let recipientId = call.request.getRecipientId();
            let response = new messages.EmailSettingsObjectReply();
            try {
                let result = yield this._controller.getSettingsById(correlationId, recipientId);
                let settings = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromEmailSettings(result);
                response.setSettings(settings);
            }
            catch (err) {
                let error = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    getSettingsByEmail(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let email = call.request.getEmail();
            let response = new messages.EmailSettingsObjectReply();
            try {
                let result = yield this._controller.getSettingsByEmail(correlationId, email);
                let grpcEmailObj = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromEmailSettings(result);
                response.setSettings(grpcEmailObj);
            }
            catch (err) {
                let error = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    setSettings(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let settings = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.toEmailSettings(call.request.getSettings());
            let response = new messages.EmailSettingsObjectReply();
            try {
                let result = yield this._controller.setSettings(correlationId, settings);
                let grpcSettingsObj = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromEmailSettings(result);
                response.setSettings(grpcSettingsObj);
            }
            catch (err) {
                let error = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    setVerifiedSettings(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let settings = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.toEmailSettings(call.request.getSettings());
            let response = new messages.EmailSettingsObjectReply();
            try {
                let result = yield this._controller.setVerifiedSettings(correlationId, settings);
                let grpcSettingsObj = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromEmailSettings(result);
                response.setSettings(grpcSettingsObj);
            }
            catch (err) {
                let error = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    setRecipient(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let recipientId = call.request.getRecipientId();
            let name = call.request.getName();
            let email = call.request.getEmail();
            let language = call.request.getLanguage();
            let response = new messages.EmailSettingsObjectReply();
            try {
                let result = yield this._controller.setRecipient(correlationId, recipientId, name, email, language);
                let grpcSettingsObj = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromEmailSettings(result);
                response.setSettings(grpcSettingsObj);
            }
            catch (err) {
                let error = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    setSubscriptions(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let recipientId = call.request.getRecipientId();
            let subscriptions = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromJson(call.request.getName());
            let response = new messages.EmailSettingsObjectReply();
            try {
                let result = yield this._controller.setSubscriptions(correlationId, recipientId, subscriptions);
                let grpcSettingsObj = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromEmailSettings(result);
                response.setSettings(grpcSettingsObj);
            }
            catch (err) {
                let error = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    deleteSettingsById(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let recipientId = call.request.getRecipientId();
            let response = new messages.EmailSettingsEmptyReply();
            try {
                yield this._controller.deleteSettingsById(correlationId, recipientId);
            }
            catch (err) {
                let error = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    resendVerification(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let recipientId = call.request.getRecipientId();
            let response = new messages.EmailSettingsEmptyReply();
            try {
                yield this._controller.resendVerification(correlationId, recipientId);
            }
            catch (err) {
                let error = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    verifyEmail(call) {
        return __awaiter(this, void 0, void 0, function* () {
            let correlationId = call.request.getCorrelationId();
            let recipientId = call.request.getRecipientId();
            let code = call.request.getCode();
            let response = new messages.EmailSettingsEmptyReply();
            try {
                yield this._controller.verifyEmail(correlationId, recipientId, code);
            }
            catch (err) {
                let error = EmailSettingsGrpcConverterV1_1.EmailSettingsGrpcConverterV1.fromError(err);
                response.setError(error);
            }
            return response;
        });
    }
    register() {
        this.registerMethod('get_settings_by_ids', null, this.getSettingsByIds);
        this.registerMethod('get_settings_by_id', null, this.getSettingsById);
        this.registerMethod('get_settings_by_email', null, this.getSettingsByEmail);
        this.registerMethod('set_settings', null, this.setSettings);
        this.registerMethod('set_verified_settings', null, this.setVerifiedSettings);
        this.registerMethod('set_recipient', null, this.setRecipient);
        this.registerMethod('set_subscriptions', null, this.setSubscriptions);
        this.registerMethod('delete_settings_by_id', null, this.deleteSettingsById);
        this.registerMethod('resend_verification', null, this.resendVerification);
        this.registerMethod('verify_email', null, this.verifyEmail);
    }
}
exports.EmailSettingsGrpcServiceV1 = EmailSettingsGrpcServiceV1;
//# sourceMappingURL=EmailSettingsGrpcServiceV1.js.map