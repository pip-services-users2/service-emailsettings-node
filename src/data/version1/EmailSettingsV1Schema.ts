import { ObjectSchema } from 'pip-services3-commons-nodex';
import { TypeCode } from 'pip-services3-commons-nodex';

export class EmailSettingsV1Schema extends ObjectSchema {
    public constructor() {
        super();
        this.withRequiredProperty('id', TypeCode.String);
        this.withOptionalProperty('name', TypeCode.String);
        this.withOptionalProperty('email', TypeCode.String);
        this.withOptionalProperty('language', TypeCode.String);
        this.withOptionalProperty('subscriptions', TypeCode.Map);
        this.withOptionalProperty('verified', TypeCode.Boolean);
        this.withOptionalProperty('ver_code', TypeCode.String);
        this.withOptionalProperty('ver_expire_time', null); // TypeCode.Date);
        this.withOptionalProperty('custom_hdr', null);
        this.withOptionalProperty('custom_dat', null);
    }
}
