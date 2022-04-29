import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableLambdaFunction } from 'pip-services3-aws-nodex';
import { EmailSettingsServiceFactory } from '../build/EmailSettingsServiceFactory';

import { EmailClientFactory } from 'client-email-node';
import { MessageTemplatesClientFactory } from 'client-msgtemplates-node';
import { ActivitiesClientFactory } from 'client-activities-node';

export class EmailSettingsLambdaFunction extends CommandableLambdaFunction {
    public constructor() {
        super("email_settings", "Email settings function");
        this._dependencyResolver.put('controller', new Descriptor('service-emailsettings', 'controller', 'default', '*', '*'));
        this._factories.add(new EmailSettingsServiceFactory());
        this._factories.add(new EmailClientFactory());
        this._factories.add(new MessageTemplatesClientFactory());
        this._factories.add(new ActivitiesClientFactory());
    }
}

export const handler = new EmailSettingsLambdaFunction().getHandler();