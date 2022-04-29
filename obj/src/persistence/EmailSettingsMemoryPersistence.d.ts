import { IdentifiableMemoryPersistence } from 'pip-services3-data-nodex';
import { EmailSettingsV1 } from '../data/version1/EmailSettingsV1';
import { IEmailSettingsPersistence } from './IEmailSettingsPersistence';
export declare class EmailSettingsMemoryPersistence extends IdentifiableMemoryPersistence<EmailSettingsV1, string> implements IEmailSettingsPersistence {
    constructor();
    getOneByEmail(correlationId: string, email: string): Promise<EmailSettingsV1>;
}
