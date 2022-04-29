import { ConfigParams } from 'pip-services3-commons-nodex';
import { JsonFilePersister } from 'pip-services3-data-nodex';
import { EmailSettingsMemoryPersistence } from './EmailSettingsMemoryPersistence';
import { EmailSettingsV1 } from '../data/version1/EmailSettingsV1';
export declare class EmailSettingsFilePersistence extends EmailSettingsMemoryPersistence {
    protected _persister: JsonFilePersister<EmailSettingsV1>;
    constructor(path?: string);
    configure(config: ConfigParams): void;
}
