"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSettingsCommandableGrpcServiceV1 = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
class EmailSettingsCommandableGrpcServiceV1 extends pip_services3_grpc_nodex_1.CommandableGrpcService {
    constructor() {
        super('v1/email_settings');
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-emailsettings', 'controller', 'default', '*', '1.0'));
    }
}
exports.EmailSettingsCommandableGrpcServiceV1 = EmailSettingsCommandableGrpcServiceV1;
//# sourceMappingURL=EmailSettingsCommandableGrpcServiceV1.js.map