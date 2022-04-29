import { EmailSettingsMemoryPersistence } from '../../src/persistence/EmailSettingsMemoryPersistence';
import { EmailSettingsPersistenceFixture } from './EmailSettingsPersistenceFixture';

suite('EmailSettingsMemoryPersistence', ()=> {
    let persistence: EmailSettingsMemoryPersistence;
    let fixture: EmailSettingsPersistenceFixture;
    
    setup(async () => {
        persistence = new EmailSettingsMemoryPersistence();
        fixture = new EmailSettingsPersistenceFixture(persistence);
        
        await persistence.open(null);
    });
    
    teardown(async () => {
        await persistence.close(null);
    });
        
    test('CRUD Operations', async () => {
        await fixture.testCrudOperations();
    });

});