"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSettingsV1Schema = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_commons_nodex_2 = require("pip-services3-commons-nodex");
class EmailSettingsV1Schema extends pip_services3_commons_nodex_1.ObjectSchema {
    constructor() {
        super();
        this.withRequiredProperty('id', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('name', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('email', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('language', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('subscriptions', pip_services3_commons_nodex_2.TypeCode.Map);
        this.withOptionalProperty('verified', pip_services3_commons_nodex_2.TypeCode.Boolean);
        this.withOptionalProperty('ver_code', pip_services3_commons_nodex_2.TypeCode.String);
        this.withOptionalProperty('ver_expire_time', null); // TypeCode.Date);
        this.withOptionalProperty('custom_hdr', null);
        this.withOptionalProperty('custom_dat', null);
    }
}
exports.EmailSettingsV1Schema = EmailSettingsV1Schema;
//# sourceMappingURL=EmailSettingsV1Schema.js.map