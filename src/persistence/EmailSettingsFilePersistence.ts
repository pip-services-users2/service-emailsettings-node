import { ConfigParams } from 'pip-services3-commons-nodex';
import { JsonFilePersister } from 'pip-services3-data-nodex';

import { EmailSettingsMemoryPersistence } from './EmailSettingsMemoryPersistence';
import { EmailSettingsV1 } from '../data/version1/EmailSettingsV1';

export class EmailSettingsFilePersistence extends EmailSettingsMemoryPersistence {
	protected _persister: JsonFilePersister<EmailSettingsV1>;

    public constructor(path?: string) {
        super();

        this._persister = new JsonFilePersister<EmailSettingsV1>(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }

    public configure(config: ConfigParams): void {
        super.configure(config);
        this._persister.configure(config);
    }

}