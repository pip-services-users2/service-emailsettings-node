"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSettingsCommandableHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class EmailSettingsCommandableHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/email_settings');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-emailsettings', 'controller', 'default', '*', '1.0'));
    }
}
exports.EmailSettingsCommandableHttpServiceV1 = EmailSettingsCommandableHttpServiceV1;
//# sourceMappingURL=EmailSettingsCommandableHttpServiceV1.js.map