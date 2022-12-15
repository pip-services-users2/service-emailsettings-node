const restify = require('restify');
const assert = require('chai').assert;

import { ConfigParams } from 'pip-services3-commons-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { EmailNullClientV1 } from 'client-email-node';

import { EmailSettingsV1 } from '../../../src/data/version1/EmailSettingsV1';
import { EmailSettingsMemoryPersistence } from '../../../src/persistence/EmailSettingsMemoryPersistence';
import { EmailSettingsController } from '../../../src/logic/EmailSettingsController';
import { EmailSettingsCommandableHttpServiceV1 } from '../../../src/services/version1/EmailSettingsCommandableHttpServiceV1';

let httpConfig = ConfigParams.fromTuples(
    "connection.protocol", "http",
    "connection.host", "localhost",
    "connection.port", 3000
);

let SETTINGS = <EmailSettingsV1> {
    id: '1',
    name: 'User 1',
    email: 'user1@conceptual.vision',
    language: 'en',
    verified: false
};

suite('EmailSettingsCommandableHttpServiceV1', ()=> {
    let service: EmailSettingsCommandableHttpServiceV1;

    let rest: any;

    suiteSetup(async () => {
        let persistence = new EmailSettingsMemoryPersistence();

        let controller = new EmailSettingsController();
        controller.configure(new ConfigParams());

        service = new EmailSettingsCommandableHttpServiceV1();
        service.configure(httpConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-emailsettings', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-emailsettings', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-email', 'client', 'null', 'default', '1.0'), new EmailNullClientV1(),
            new Descriptor('service-emailsettings', 'service', 'http', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });
    
    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let url = 'http://localhost:3000';
        rest = restify.createJsonClient({ url: url, version: '*' });
    });

    test('CRUD Operations', async () => {
        let settings1: EmailSettingsV1;

        // Create one account
        let settings = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/email_settings/set_settings',
                {
                    settings: SETTINGS
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(settings);
        assert.equal(settings.id, SETTINGS.id);
        assert.equal(settings.email, SETTINGS.email);
        assert.isFalse(settings.verified);

        settings1 = settings;

        // Update the settings
        settings1.subscriptions.engagement = true;

        settings = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/email_settings/set_settings',
                {
                    settings: settings1
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        assert.isObject(settings);
        assert.equal(settings.id, settings1.id)
        assert.isTrue(settings.subscriptions.engagement);

        // Delete settings
        await new Promise<any>((resolve, reject) => {
            rest.post('/v1/email_settings/delete_settings_by_id',
                {
                    recipient_id: settings1.id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(result);
                    else reject(err);
                }
            );
        });

        // Try to get deleted settings
        settings = await new Promise<any>((resolve, reject) => {
            rest.post('/v1/email_settings/get_settings_by_id',
                {
                    recipient_id: settings1.id
                },
                (err, req, res, result) => {
                    if (err == null) resolve(Object.keys(result).length == 0 ? null : result);
                    else reject(err);
                }
            );
        });


        assert.isNull(settings);
    });
        
});