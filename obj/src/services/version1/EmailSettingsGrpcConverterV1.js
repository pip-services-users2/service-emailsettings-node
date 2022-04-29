"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSettingsGrpcConverterV1 = void 0;
const messages = require('../../../../src/protos/emailsettings_v1_pb');
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_3 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_4 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_5 = require("pip-services3-commons-nodex");
class EmailSettingsGrpcConverterV1 {
    static fromError(err) {
        if (err == null)
            return null;
        let description = pip_services3_commons_nodex_4.ErrorDescriptionFactory.create(err);
        let obj = new messages.ErrorDescription();
        obj.setType(description.type);
        obj.setCategory(description.category);
        obj.setCode(description.code);
        obj.setCorrelationId(description.correlation_id);
        obj.setStatus(description.status);
        obj.setMessage(description.message);
        obj.setCause(description.cause);
        obj.setStackTrace(description.stack_trace);
        EmailSettingsGrpcConverterV1.setMap(obj.getDetailsMap(), description.details);
        return obj;
    }
    static toError(obj) {
        if (obj == null || (obj.getCategory() == "" && obj.getMessage() == ""))
            return null;
        let description = {
            type: obj.getType(),
            category: obj.getCategory(),
            code: obj.getCode(),
            correlation_id: obj.getCorrelationId(),
            status: obj.getStatus(),
            message: obj.getMessage(),
            cause: obj.getCause(),
            stack_trace: obj.getStackTrace(),
            details: EmailSettingsGrpcConverterV1.getMap(obj.getDetailsMap())
        };
        return pip_services3_commons_nodex_5.ApplicationExceptionFactory.create(description);
    }
    static setMap(map, values) {
        if (values == null)
            return;
        if (typeof values.toObject == 'function')
            values = values.toObject();
        if (Array.isArray(values)) {
            for (let entry of values) {
                if (Array.isArray(entry))
                    map[entry[0]] = entry[1];
            }
        }
        else {
            if (typeof map.set == 'function') {
                for (let propName in values) {
                    if (values.hasOwnProperty(propName))
                        map.set(propName, values[propName]);
                }
            }
            else {
                for (let propName in values) {
                    if (values.hasOwnProperty(propName))
                        map[propName] = values[propName];
                }
            }
        }
    }
    static getMap(map) {
        let values = {};
        EmailSettingsGrpcConverterV1.setMap(values, map);
        return values;
    }
    static toJson(value) {
        if (value == null || value == "")
            return null;
        return JSON.stringify(value);
    }
    static fromJson(value) {
        if (value == null || value == "")
            return null;
        return JSON.parse(value);
    }
    static fromPagingParams(paging) {
        if (paging == null)
            return null;
        let obj = new messages.PagingParams();
        obj.setSkip(paging.skip);
        obj.setTake(paging.take);
        obj.setTotal(paging.total);
        return obj;
    }
    static toPagingParams(obj) {
        if (obj == null)
            return null;
        let paging = new pip_services3_commons_nodex_1.PagingParams(obj.getSkip(), obj.getTake(), obj.getTotal());
        return paging;
    }
    static fromEmailSettings(settings) {
        if (settings == null)
            return null;
        let obj = new messages.EmailSettings();
        obj.setId(settings.id);
        obj.setName(settings.name);
        obj.setEmail(settings.email);
        obj.setLanguage(settings.language);
        obj.setSubscriptions(EmailSettingsGrpcConverterV1.toJson(settings.subscriptions));
        obj.setVerified(settings.verified);
        obj.setVerCode(settings.ver_code);
        obj.setVerExpireTime(pip_services3_commons_nodex_2.StringConverter.toString(settings.ver_expire_time));
        obj.setCustomHdr(EmailSettingsGrpcConverterV1.toJson(settings.custom_hdr));
        obj.setCustomDat(EmailSettingsGrpcConverterV1.toJson(settings.custom_dat));
        return obj;
    }
    static toEmailSettings(obj) {
        if (obj == null)
            return null;
        let settings = {
            id: obj.getId(),
            name: obj.getName(),
            email: obj.getEmail(),
            language: obj.getLanguage(),
            subscriptions: EmailSettingsGrpcConverterV1.fromJson(obj.getSubscriptions()),
            verified: obj.getVerified(),
            ver_code: obj.getVerCode(),
            ver_expire_time: pip_services3_commons_nodex_3.DateTimeConverter.toDateTime(obj.getVerExpireTime()),
            custom_hdr: EmailSettingsGrpcConverterV1.fromJson(obj.getCustomHdr()),
            custom_dat: EmailSettingsGrpcConverterV1.fromJson(obj.getCustomDat())
        };
        return settings;
    }
    static fromEmailSettingsList(settings) {
        if (settings == null)
            return null;
        let data = settings.map(EmailSettingsGrpcConverterV1.fromEmailSettings);
        return data;
    }
    static toEmailSettingsList(obj) {
        if (obj == null)
            return null;
        let data = obj.map(EmailSettingsGrpcConverterV1.toEmailSettings);
        return data;
    }
}
exports.EmailSettingsGrpcConverterV1 = EmailSettingsGrpcConverterV1;
//# sourceMappingURL=EmailSettingsGrpcConverterV1.js.map