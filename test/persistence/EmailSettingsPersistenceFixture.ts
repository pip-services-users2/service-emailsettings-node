const assert = require('chai').assert;

import { EmailSettingsV1 } from '../../src/data/version1/EmailSettingsV1';
import { IEmailSettingsPersistence } from '../../src/persistence/IEmailSettingsPersistence';

let SETTINGS1 = <EmailSettingsV1> {
    id: '1',
    name: 'User 1',
    email: 'user1@conceptual.vision',
    language: 'en',
    verified: false,
    ver_code: null,
    subscriptions: { notifications: true, ads: false }
};
let SETTINGS2 = <EmailSettingsV1> {
    id: '2',
    name: 'User 2',
    email: 'user2@conceptual.vision',
    language: 'en',
    verified: false,
    ver_code: null,
    subscriptions: { notifications: true, ads: true }
};
let SETTINGS3 = <EmailSettingsV1> {
    id: '3',
    name: 'User 3',
    email: 'user3@conceptual.vision',
    language: 'en',
    verified: false,
    ver_code: null,
    subscriptions: { notifications: false, ads: false }
};

export class EmailSettingsPersistenceFixture {
    private _persistence: IEmailSettingsPersistence;
    
    constructor(persistence: IEmailSettingsPersistence) {
        assert.isNotNull(persistence);
        this._persistence = persistence;
    }
                
    public async testCrudOperations() {
        let settings1: EmailSettingsV1;

        // Create items
        let settings = await this._persistence.set(null, SETTINGS1);

        assert.isObject(settings);
        assert.equal(settings.id, SETTINGS1.id);
        assert.equal(settings.email, SETTINGS1.email);
        assert.isFalse(settings.verified);
        assert.isNull(settings.ver_code || null);

        // Get settings by email
        settings = await this._persistence.getOneByEmail(null, SETTINGS1.email);

        assert.isObject(settings);
        assert.equal(settings.id, SETTINGS1.id);

        settings1 = settings;

        // Update settings
        settings1.email = 'newuser@conceptual.vision';

        settings = await this._persistence.set(null, settings1);

        assert.isObject(settings);
        assert.equal(settings.id, SETTINGS1.id)
        assert.isFalse(settings.verified);
        assert.equal(settings.email, 'newuser@conceptual.vision');

        // Try to get deleted settings
        let settingsList = await this._persistence.getListByIds(null, [SETTINGS1.id]);

        assert.lengthOf(settingsList, 1);

        // Delete settings
        await this._persistence.deleteById(null, SETTINGS1.id);

        // Try to get deleted settings
        settings = await this._persistence.getOneById(null, SETTINGS1.id);

        assert.isNull(settings || null);
    }
}
