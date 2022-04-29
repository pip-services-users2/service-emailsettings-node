"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handler = exports.EmailSettingsLambdaFunction = void 0;
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const pip_services3_aws_nodex_1 = require("pip-services3-aws-nodex");
const EmailSettingsServiceFactory_1 = require("../build/EmailSettingsServiceFactory");
const client_email_node_1 = require("client-email-node");
const client_msgtemplates_node_1 = require("client-msgtemplates-node");
const client_activities_node_1 = require("client-activities-node");
class EmailSettingsLambdaFunction extends pip_services3_aws_nodex_1.CommandableLambdaFunction {
    constructor() {
        super("email_settings", "Email settings function");
        this._dependencyResolver.put('controller', new pip_services3_commons_nodex_1.Descriptor('service-emailsettings', 'controller', 'default', '*', '*'));
        this._factories.add(new EmailSettingsServiceFactory_1.EmailSettingsServiceFactory());
        this._factories.add(new client_email_node_1.EmailClientFactory());
        this._factories.add(new client_msgtemplates_node_1.MessageTemplatesClientFactory());
        this._factories.add(new client_activities_node_1.ActivitiesClientFactory());
    }
}
exports.EmailSettingsLambdaFunction = EmailSettingsLambdaFunction;
exports.handler = new EmailSettingsLambdaFunction().getHandler();
//# sourceMappingURL=EmailSettingsLambdaFunction.js.map