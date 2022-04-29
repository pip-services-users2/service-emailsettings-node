import { ProcessContainer } from 'pip-services3-container-nodex';

import { ActivitiesClientFactory } from 'client-activities-node';
import { MessageTemplatesClientFactory } from 'client-msgtemplates-node';
import { EmailClientFactory } from 'client-email-node';
import { DefaultRpcFactory } from 'pip-services3-rpc-nodex';
import { DefaultGrpcFactory } from 'pip-services3-grpc-nodex';
import { DefaultSwaggerFactory } from 'pip-services3-swagger-nodex';

import { EmailSettingsServiceFactory } from '../build/EmailSettingsServiceFactory';

export class EmailSettingsProcess extends ProcessContainer {

    public constructor() {
        super("email_settings", "Email settings microservice");
        this._factories.add(new EmailSettingsServiceFactory);
        this._factories.add(new ActivitiesClientFactory());
        this._factories.add(new MessageTemplatesClientFactory());
        this._factories.add(new EmailClientFactory());
        this._factories.add(new DefaultRpcFactory());
        this._factories.add(new DefaultGrpcFactory());
        this._factories.add(new DefaultSwaggerFactory());
    }


}
