import { IGetter } from 'pip-services3-data-nodex';
import { IWriter } from 'pip-services3-data-nodex';

import { EmailSettingsV1 } from '../data/version1/EmailSettingsV1';

export interface IEmailSettingsPersistence 
    extends IGetter<EmailSettingsV1, string>, IWriter<EmailSettingsV1, string> 
{
    getListByIds(correlationId: string, ids: string[]): Promise<EmailSettingsV1[]>;

    getOneById(correlation_id: string, id: string): Promise<EmailSettingsV1>;

    getOneByEmail(correlation_id: string, email: string): Promise<EmailSettingsV1>;

    set(correlation_id: string, item: EmailSettingsV1): Promise<EmailSettingsV1>;
    
    deleteById(correlation_id: string, id: string): Promise<EmailSettingsV1>;
}
