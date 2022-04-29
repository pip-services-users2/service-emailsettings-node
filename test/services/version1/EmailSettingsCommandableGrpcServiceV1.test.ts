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
import { EmailSettingsCommandableGrpcServiceV1 } from '../../../src/services/version1/EmailSettingsCommandableGrpcServiceV1';

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

suite('EmailSettingsCommandableGrpcServiceV1', ()=> {
    let service: EmailSettingsCommandableGrpcServiceV1;

    let client: any;

    suiteSetup(async () => {
        let persistence = new EmailSettingsMemoryPersistence();
        let controller = new EmailSettingsController();

        service = new EmailSettingsCommandableGrpcServiceV1();
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
    
    suiteTeardown(async () => {
        await service.close(null);
    });

    setup(() => {
        let packageDefinition = protoLoader.loadSync(
            __dirname + "../../../../../node_modules/pip-services3-grpc-nodex/src/protos/commandable.proto",
            {
                keepCase: true,
                longs: Number,
                enums: Number,
                defaults: true,
                oneofs: true
            }
        );
        let clientProto = grpc.loadPackageDefinition(packageDefinition).commandable.Commandable;

        client = new clientProto('localhost:3000', grpc.credentials.createInsecure());
    });

    test('CRUD Operations', async () => {
        let settings1: EmailSettingsV1;

        // Create email settings
        let response = await new Promise<any>((resolve, reject) => { 
            client.invoke(
                {
                    method: 'v1/email_settings.set_settings',
                    args_empty: false,
                    args_json: JSON.stringify({
                        settings: SETTINGS
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        let settings = JSON.parse(response.result_json);

        assert.isObject(settings);
        assert.equal(settings.id, SETTINGS.id);
        assert.equal(settings.email, SETTINGS.email);
        assert.isFalse(settings.verified);

        settings1 = settings;

        // Update the settings
        settings1.subscriptions.engagement = true;

        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/email_settings.set_settings',
                    args_empty: false,
                    args_json: JSON.stringify({
                        settings: settings1
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isFalse(response.result_empty);
        assert.isString(response.result_json);
        settings = JSON.parse(response.result_json);

        assert.isObject(settings);
        assert.equal(settings.id, settings1.id)
        assert.isTrue(settings.subscriptions.engagement);

        // Delete settings
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/email_settings.delete_settings_by_id',
                    args_empty: false,
                    args_json: JSON.stringify({
                        recipient_id: settings1.id
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isTrue(response.result_empty);

        // Try to get deleted settings
        response = await new Promise<any>((resolve, reject) => {
            client.invoke(
                {
                    method: 'v1/email_settings.get_settings_by_id',
                    args_empty: false,
                    args_json: JSON.stringify({
                        recipient_id: settings1.id
                    })
                },
                (err, response) => {
                    if (err != null) reject(err);
                    else resolve(response);
                }
            );
        });

        assert.isTrue(response.result_empty);
    });

});
