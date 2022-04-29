import { IdentifiableMongoDbPersistence } from 'pip-services3-mongodb-nodex';

import { EmailSettingsV1 } from '../data/version1/EmailSettingsV1';
import { IEmailSettingsPersistence } from './IEmailSettingsPersistence';

export class EmailSettingsMongoDbPersistence 
    extends IdentifiableMongoDbPersistence<EmailSettingsV1, string> 
    implements IEmailSettingsPersistence {

    constructor() {
        super('email_settings');
    }

    public async getOneByEmail(correlationId: string, email: string): Promise<EmailSettingsV1> {
        return await new Promise<EmailSettingsV1>((resolve, reject) => { 
            this._collection.findOne(
                {
                    email: email
                },
                (err, item) => {
                    if (err != null) reject(err)

                    this._logger.trace(correlationId, "Retrieved from %s with email = %s", this._collection, email);
                    item = this.convertToPublic(item);
                    resolve(item);
                }
            );
        });
    }
}
