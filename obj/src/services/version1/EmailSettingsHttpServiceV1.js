"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSettingsHttpServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
class EmailSettingsHttpServiceV1 extends pip_services3_rpc_nodex_1.CommandableHttpService {
    constructor() {
        super('v1/email_settings');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-emailsettings', 'controller', 'default', '*', '1.0'));
    }
}
exports.EmailSettingsHttpServiceV1 = EmailSettingsHttpServiceV1;
//# sourceMappingURL=EmailSettingsHttpServiceV1.js.map