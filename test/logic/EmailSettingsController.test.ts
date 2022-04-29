const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { EmailNullClientV1 } from 'client-email-node';

import { EmailSettingsV1 } from '../../src/data/version1/EmailSettingsV1';
import { EmailSettingsMemoryPersistence } from '../../src/persistence/EmailSettingsMemoryPersistence';
import { EmailSettingsController } from '../../src/logic/EmailSettingsController';

let SETTINGS = <EmailSettingsV1>{
    id: '1',
    name: 'User 1',
    email: 'user1@conceptual.vision',
    language: 'en',
    verified: false
};

suite('EmailSettingsController', () => {
    let persistence: EmailSettingsMemoryPersistence;
    let controller: EmailSettingsController;

    setup(() => {
        persistence = new EmailSettingsMemoryPersistence();

        controller = new EmailSettingsController();
        controller.configure(new ConfigParams());

        let references: References = References.fromTuples(
            new Descriptor('service-emailsettings', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-emailsettings', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-email', 'client', 'null', 'default', '1.0'), new EmailNullClientV1()
        );
        controller.setReferences(references);
    });

    test('CRUD Operations', async () => {
        let settings1: EmailSettingsV1;

        // Create email settings
        let settings = await controller.setSettings(null, SETTINGS);

        assert.isObject(settings);
        assert.equal(settings.id, SETTINGS.id);
        assert.equal(settings.email, SETTINGS.email);
        assert.isFalse(settings.verified);

        settings1 = settings;

        // Update the settings
        settings1.subscriptions.engagement = true;
        settings = await controller.setSettings(null, settings1);

        assert.isObject(settings);
        assert.equal(settings.id, settings1.id)
        assert.isTrue(settings.subscriptions.engagement);

        // Get settings
        let settingsList = await controller.getSettingsByIds(null, [settings1.id]);
        assert.lengthOf(settingsList, 1);

        // Delete settings
        await controller.deleteSettingsById(null, settings1.id);

        // Try to get deleted settings
        settings = await controller.getSettingsById(null, settings1.id);

        assert.isNull(settings);
    });

    test('Verify Email', async () => {
        let settings1: EmailSettingsV1;

        // Create new settings
        settings1 = Object.assign({}, SETTINGS);
        settings1.ver_code = '123';
        settings1.verified = false;
        settings1.ver_expire_time = new Date(new Date().getTime() + 10000);

        let settings = await persistence.set(null, settings1);

        assert.isObject(settings);
        settings1 = settings;

        assert.isFalse(settings.verified);
        assert.isDefined(settings.ver_code);

        // Verify email
        await controller.verifyEmail(null, settings1.id, settings1.ver_code);

        // Check settings
        settings = await persistence.getOneById(null, settings1.id);

        assert.isObject(settings);
        assert.isTrue(settings.verified);
        assert.isNull(settings.ver_code);

    });

    test('Change verification code length', async () => {
        let settings1: EmailSettingsV1;
        controller.configure(ConfigParams.fromTuples("options.code_length", "6"));

        // Create new settings
        let settings = await persistence.set(null, SETTINGS);

        assert.isObject(settings);
        settings1 = settings;

        assert.isFalse(settings.verified);
        assert.isUndefined(settings.ver_code);

        // Verify email
        await controller.resendVerification(null, settings1.id);

        // Check settings
        settings = await persistence.getOneById(null, settings1.id);

        assert.isObject(settings);
        settings1 = settings;

        assert.isFalse(settings.verified);
        assert.isNotNull(settings.ver_code);
        assert.equal(settings.ver_code.length, 6);

    });

    test('Resend Verification Email', async () => {
        let settings1: EmailSettingsV1;

        // Create new settings
        let settings = await persistence.set(null, SETTINGS);

        assert.isObject(settings);
        settings1 = settings;

        assert.isFalse(settings.verified);
        assert.isUndefined(settings.ver_code);

        // Verify email
        await controller.resendVerification(null, settings1.id);

        // Check settings
        await persistence.getOneById(null, settings1.id);

        assert.isObject(settings);
        assert.isFalse(settings.verified);
        assert.isNotNull(settings.ver_code);
        assert.equal(settings.ver_code.length, 9);
    });

});