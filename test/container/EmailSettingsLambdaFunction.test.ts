const assert = require('chai').assert;


import { ConfigParams } from 'pip-services3-commons-nodex';

import { EmailSettingsV1 } from '../../src/data/version1/EmailSettingsV1';
import { EmailSettingsLambdaFunction } from '../../src/container/EmailSettingsLambdaFunction';

let SETTINGS = <EmailSettingsV1> {
    id: '1',
    name: 'User 1',
    email: 'user1@conceptual.vision',
    language: 'en',
    verified: false
};

suite('EmailSettingsLambdaFunction', ()=> {
    let lambda: EmailSettingsLambdaFunction;

    suiteSetup(async () => {
        let config = ConfigParams.fromTuples(
            'logger.descriptor', 'pip-services:logger:console:default:1.0',
            'persistence.descriptor', 'service-emailsettings:persistence:memory:default:1.0',
            'controller.descriptor', 'service-emailsettings:controller:default:default:1.0',
            'emaildelivery.descriptor', 'service-email:client:null:default:1.0'
        );

        lambda = new EmailSettingsLambdaFunction();
        lambda.configure(config);
        await lambda.open(null);
    });
    
    suiteTeardown(async () => {
        await lambda.close(null);
    });
    

    test('CRUD Operations', async () => {
        let settings1: EmailSettingsV1;

        // Create email settings
        let settings = await lambda.act(
            {
                role: 'email_settings',
                cmd: 'set_settings',
                settings: SETTINGS
            }
        );

        assert.isObject(settings);
        assert.equal(settings.id, SETTINGS.id);
        assert.equal(settings.email, SETTINGS.email);
        assert.isFalse(settings.verified);

        settings1 = settings;

        settings1.subscriptions.engagement = true;

        settings = await lambda.act(
            {
                role: 'email_settings',
                cmd: 'set_settings',
                settings: settings1
            }
        );

        assert.isObject(settings);
        assert.equal(settings.id, settings1.id)
        assert.isTrue(settings.subscriptions.engagement);


        // Delete settings
        await lambda.act(
            {
                role: 'email_settings',
                cmd: 'delete_settings_by_id',
                recipient_id: SETTINGS.id
            }
        );

        // Try to get deleted settings
        settings = await lambda.act(
            {
                role: 'email_settings',
                cmd: 'get_settings_by_id',
                recipient_id: SETTINGS.id
            }
        );

        assert.isNull(settings);
    });
});