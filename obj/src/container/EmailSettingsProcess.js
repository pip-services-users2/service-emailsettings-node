"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSettingsProcess = void 0;
const pip_services3_container_nodex_1 = require("pip-services3-container-nodex");
const client_activities_node_1 = require("client-activities-node");
const client_msgtemplates_node_1 = require("client-msgtemplates-node");
const client_email_node_1 = require("client-email-node");
const pip_services3_rpc_nodex_1 = require("pip-services3-rpc-nodex");
const pip_services3_grpc_nodex_1 = require("pip-services3-grpc-nodex");
const pip_services3_swagger_nodex_1 = require("pip-services3-swagger-nodex");
const EmailSettingsServiceFactory_1 = require("../build/EmailSettingsServiceFactory");
class EmailSettingsProcess extends pip_services3_container_nodex_1.ProcessContainer {
    constructor() {
        super("email_settings", "Email settings microservice");
        this._factories.add(new EmailSettingsServiceFactory_1.EmailSettingsServiceFactory);
        this._factories.add(new client_activities_node_1.ActivitiesClientFactory());
        this._factories.add(new client_msgtemplates_node_1.MessageTemplatesClientFactory());
        this._factories.add(new client_email_node_1.EmailClientFactory());
        this._factories.add(new pip_services3_rpc_nodex_1.DefaultRpcFactory());
        this._factories.add(new pip_services3_grpc_nodex_1.DefaultGrpcFactory());
        this._factories.add(new pip_services3_swagger_nodex_1.DefaultSwaggerFactory());
    }
}
exports.EmailSettingsProcess = EmailSettingsProcess;
//# sourceMappingURL=EmailSettingsProcess.js.map