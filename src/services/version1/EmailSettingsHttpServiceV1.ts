import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableHttpService } from 'pip-services3-rpc-nodex';

export class EmailSettingsHttpServiceV1 extends CommandableHttpService {
    public constructor() {
        super('v1/email_settings');
        this._dependencyResolver.put('controller', new Descriptor('service-emailsettings', 'controller', 'default', '*', '1.0'));
    }
}