import { EmailSettingsFilePersistence } from '../../src/persistence/EmailSettingsFilePersistence';
import { EmailSettingsPersistenceFixture } from './EmailSettingsPersistenceFixture';

suite('EmailSettingsFilePersistence', ()=> {
    let persistence: EmailSettingsFilePersistence;
    let fixture: EmailSettingsPersistenceFixture;
    
    setup(async () => {
        persistence = new EmailSettingsFilePersistence('./data/email_settings.test.json');

        fixture = new EmailSettingsPersistenceFixture(persistence);
        
        await persistence.open(null);
        await persistence.clear(null);
    });
    
    teardown(async () => {
        await persistence.close(null);
    });
        
    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });
});