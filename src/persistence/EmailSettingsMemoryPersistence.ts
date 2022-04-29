import { IdentifiableMemoryPersistence } from 'pip-services3-data-nodex';

import { EmailSettingsV1 } from '../data/version1/EmailSettingsV1';
import { IEmailSettingsPersistence } from './IEmailSettingsPersistence';

export class EmailSettingsMemoryPersistence 
    extends IdentifiableMemoryPersistence<EmailSettingsV1, string> 
    implements IEmailSettingsPersistence {

    constructor() {
        super();
    }

    public async getOneByEmail(correlationId: string, email: string): Promise<EmailSettingsV1> {
        
        let items = this._items.filter((x) => {return x.email == email;});
        let item = items.length > 0 ? items[0] : null;

        if (item != null)
            this._logger.trace(correlationId, "Retrieved %s by %s", item, email);
        else
            this._logger.trace(correlationId, "Cannot find item by %s", email);

        return item;
    }
}
