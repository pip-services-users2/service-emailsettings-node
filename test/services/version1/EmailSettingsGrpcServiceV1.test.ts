const assert = require('chai').assert;
const grpc = require('grpc');
const protoLoader = require('@grpc/proto-loader');

import { Descriptor } from 'pip-services3-commons-nodex';
import { ConfigParams } from 'pip-services3-commons-nodex';
import { References } from 'pip-services3-commons-nodex';

import { EmailNullClientV1 } from 'client-email-node';

import { EmailSettingsV1 } from '../../../src/data/version1/EmailSettingsV1';
import { EmailSettingsMemoryPersistence } from '../../../src/persistence/EmailSettingsMemoryPersistence';
import { EmailSettingsController } from '../../../src/logic/EmailSettingsController';
import { EmailSettingsGrpcServiceV1 } from '../../../src/services/version1/EmailSettingsGrpcServiceV1';
import { EmailSettingsGrpcConverterV1 } from '../../../src/services/version1/EmailSettingsGrpcConverterV1';

var grpcConfig = ConfigParams.fromTuples(
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

suite('EmailSettingsGrpcServiceV1', ()=> {
    let service: EmailSettingsGrpcServiceV1;

    let client: any;

    suiteSetup(async () => {
        let persistence = new EmailSettingsMemoryPersistence();
        let controller = new EmailSettingsController();

        service = new EmailSettingsGrpcServiceV1();
        service.configure(grpcConfig);

        let references: References = References.fromTuples(
            new Descriptor('service-emailsettings', 'persistence', 'memory', 'default', '1.0'), persistence,
            new Descriptor('service-emailsettings', 'controller', 'default', 'default', '1.0'), controller,
            new Descriptor('service-email', 'client', 'null', 'default', '1.0'), new EmailNullClientV1(),
            new Descriptor('service-emailsettings', 'service', 'grpc', 'default', '1.0'), service
        );
        controller.setReferences(references);
        service.setReferences(references);

        await service.open(null);
    });
    
    suiteTeardown( async () => {
        await service.close(null);
    });

    setup(() => {
        let packageDefinition = protoLoader.loadSync(
            __dirname + "../../../../../src/protos/emailsettings_v1.proto",
            {
                keepCase: true,
                longs: Number,
                enums: Number,
                defaults: true,
                oneofs: true
            }
        );
        let clientProto = grpc.loadPackageDefinition(packageDefinition).emailsettings_v1.EmailSettingsx;

        client = new clientProto('localhost:3000', grpc.credentials.createInsecure());
    });

    test('CRUD Operations', async () => {
        let settings1: EmailSettingsV1;

        // Create email settings
        let settings = await new Promise<any>((resolve, reject) => {
            client.set_settings(
                {
                    settings: SETTINGS
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.settings);
                }
            );
        });

        assert.isObject(settings);
        assert.equal(settings.id, SETTINGS.id);
        assert.equal(settings.email, SETTINGS.email);
        assert.isFalse(settings.verified);

        settings1 = settings;

        // Update the settings
        settings1.subscriptions = '{"engagement": true}';
        // settings1.subscriptions.engagement = true;

        settings = await new Promise<any>((resolve, reject) => {
            client.set_settings(
                {
                    settings: settings1
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.settings);
                }
            );
        });

        assert.isObject(settings);
        assert.equal(settings.id, settings1.id)

        let subscriptions = EmailSettingsGrpcConverterV1.fromJson(settings.subscriptions);
        assert.isTrue(subscriptions.engagement);


        // Delete settings
        await new Promise<any>((resolve, reject) => {
            client.delete_settings_by_id(
                {
                    recipient_id: settings1.id
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.settings);
                }
            );
        });

        // Try to get deleted settings
        settings = await new Promise<any>((resolve, reject) => {
            client.get_settings_by_id(
                {
                    recipient_id: settings1.id
                },
                (err, response) => {
                    if (err != null || response.error != null) reject(err ?? response.error);
                    else resolve(response.settings ?? null);
                }
            );
        });

        assert.isNull(settings);
    });
    
});
