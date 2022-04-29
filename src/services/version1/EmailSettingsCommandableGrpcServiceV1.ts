import { Descriptor } from 'pip-services3-commons-nodex';
import { CommandableGrpcService } from 'pip-services3-grpc-nodex';

export class EmailSettingsCommandableGrpcServiceV1 extends CommandableGrpcService {
    public constructor() {
        super('v1/email_settings');
        this._dependencyResolver.put('controller', new Descriptor('service-emailsettings', 'controller', 'default', '*', '1.0'));
    }
}