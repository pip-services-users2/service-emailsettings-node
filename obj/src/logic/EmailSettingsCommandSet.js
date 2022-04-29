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
exports.EmailSettingsCommandSet = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
const EmailSettingsV1Schema_1 = require("../data/version1/EmailSettingsV1Schema");
class EmailSettingsCommandSet extends pip_services3_commons_nodex_1.CommandSet {
    constructor(logic) {
        super();
        this._logic = logic;
        this.addCommand(this.makeGetSettingsByIdsCommand());
        this.addCommand(this.makeGetSettingsByIdCommand());
        this.addCommand(this.makeGetSettingsByEmailSettingsCommand());
        this.addCommand(this.makeSetSettingsCommand());
        this.addCommand(this.makeSetVerifiedSettingsCommand());
        this.addCommand(this.makeSetRecipientCommand());
        this.addCommand(this.makeSetSubscriptionsCommand());
        this.addCommand(this.makeDeleteSettingsByIdCommand());
        this.addCommand(this.makeResendVerificationCommand());
        this.addCommand(this.makeVerifyEmailCommand());
    }
    makeGetSettingsByIdsCommand() {
        return new pip_services3_commons_nodex_2.Command("get_settings_by_ids", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('recipient_ids', new pip_services3_commons_nodex_4.ArraySchema(pip_services3_commons_nodex_5.TypeCode.String)), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let recipientIds = args.get("recipient_ids");
            return yield this._logic.getSettingsByIds(correlationId, recipientIds);
        }));
    }
    makeGetSettingsByIdCommand() {
        return new pip_services3_commons_nodex_2.Command("get_settings_by_id", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('recipient_id', pip_services3_commons_nodex_5.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let recipientId = args.getAsNullableString("recipient_id");
            return yield this._logic.getSettingsById(correlationId, recipientId);
        }));
    }
    makeGetSettingsByEmailSettingsCommand() {
        return new pip_services3_commons_nodex_2.Command("get_settings_by_email", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('email', pip_services3_commons_nodex_5.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let email = args.getAsNullableString("email");
            return yield this._logic.getSettingsByEmail(correlationId, email);
        }));
    }
    makeSetSettingsCommand() {
        return new pip_services3_commons_nodex_2.Command("set_settings", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('settings', new EmailSettingsV1Schema_1.EmailSettingsV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let settings = args.get("settings");
            return yield this._logic.setSettings(correlationId, settings);
        }));
    }
    makeSetVerifiedSettingsCommand() {
        return new pip_services3_commons_nodex_2.Command("set_verified_settings", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('settings', new EmailSettingsV1Schema_1.EmailSettingsV1Schema()), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let settings = args.get("settings");
            return yield this._logic.setVerifiedSettings(correlationId, settings);
        }));
    }
    makeSetRecipientCommand() {
        return new pip_services3_commons_nodex_2.Command("set_recipient", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('recipient_id', pip_services3_commons_nodex_5.TypeCode.String)
            .withOptionalProperty('name', pip_services3_commons_nodex_5.TypeCode.String)
            .withOptionalProperty('email', pip_services3_commons_nodex_5.TypeCode.String)
            .withOptionalProperty('language', pip_services3_commons_nodex_5.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let recipientId = args.getAsString("recipient_id");
            let name = args.getAsString("name");
            let email = args.getAsString("email");
            let language = args.getAsString("language");
            return yield this._logic.setRecipient(correlationId, recipientId, name, email, language);
        }));
    }
    makeSetSubscriptionsCommand() {
        return new pip_services3_commons_nodex_2.Command("set_subscriptions", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('recipient_id', pip_services3_commons_nodex_5.TypeCode.String)
            .withRequiredProperty('subscriptions', pip_services3_commons_nodex_5.TypeCode.Map), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let recipientId = args.getAsString("recipient_id");
            let subscriptions = args.get("subscriptions");
            return yield this._logic.setSubscriptions(correlationId, recipientId, subscriptions);
        }));
    }
    makeDeleteSettingsByIdCommand() {
        return new pip_services3_commons_nodex_2.Command("delete_settings_by_id", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('recipient_id', pip_services3_commons_nodex_5.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let recipientId = args.getAsNullableString("recipient_id");
            return yield this._logic.deleteSettingsById(correlationId, recipientId);
        }));
    }
    makeResendVerificationCommand() {
        return new pip_services3_commons_nodex_2.Command("resend_verification", null, (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let recipientId = args.getAsString("recipient_id");
            return yield this._logic.resendVerification(correlationId, recipientId);
        }));
    }
    makeVerifyEmailCommand() {
        return new pip_services3_commons_nodex_2.Command("verify_email", new pip_services3_commons_nodex_3.ObjectSchema(true)
            .withRequiredProperty('recipient_id', pip_services3_commons_nodex_5.TypeCode.String), (correlationId, args) => __awaiter(this, void 0, void 0, function* () {
            let recipientId = args.getAsString("recipient_id");
            let code = args.getAsString("code");
            return yield this._logic.verifyEmail(correlationId, recipientId, code);
        }));
    }
}
exports.EmailSettingsCommandSet = EmailSettingsCommandSet;
//# sourceMappingURL=EmailSettingsCommandSet.js.map