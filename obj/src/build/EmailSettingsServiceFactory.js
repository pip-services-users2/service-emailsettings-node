"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSettingsServiceFactory = void 0;
const pip_services3_components_nodex_1 = require("pip-services3-components-nodex");
const pip_services3_commons_nodex_1 = require("pip-services3-commons-nodex");
const EmailSettingsMongoDbPersistence_1 = require("../persistence/EmailSettingsMongoDbPersistence");
const EmailSettingsFilePersistence_1 = require("../persistence/EmailSettingsFilePersistence");
const EmailSettingsMemoryPersistence_1 = require("../persistence/EmailSettingsMemoryPersistence");
const EmailSettingsController_1 = require("../logic/EmailSettingsController");
const EmailSettingsCommandableHttpServiceV1_1 = require("../services/version1/EmailSettingsCommandableHttpServiceV1");
const EmailSettingsCommandableGrpcServiceV1_1 = require("../services/version1/EmailSettingsCommandableGrpcServiceV1");
const EmailSettingsGrpcServiceV1_1 = require("../services/version1/EmailSettingsGrpcServiceV1");
class EmailSettingsServiceFactory extends pip_services3_components_nodex_1.Factory {
    constructor() {
        super();
        this.registerAsType(EmailSettingsServiceFactory.MemoryPersistenceDescriptor, EmailSettingsMemoryPersistence_1.EmailSettingsMemoryPersistence);
        this.registerAsType(EmailSettingsServiceFactory.FilePersistenceDescriptor, EmailSettingsFilePersistence_1.EmailSettingsFilePersistence);
        this.registerAsType(EmailSettingsServiceFactory.MongoDbPersistenceDescriptor, EmailSettingsMongoDbPersistence_1.EmailSettingsMongoDbPersistence);
        this.registerAsType(EmailSettingsServiceFactory.ControllerDescriptor, EmailSettingsController_1.EmailSettingsController);
        this.registerAsType(EmailSettingsServiceFactory.CmdHttpServiceDescriptor, EmailSettingsCommandableHttpServiceV1_1.EmailSettingsCommandableHttpServiceV1);
        this.registerAsType(EmailSettingsServiceFactory.CommandableGrpcServiceDescriptor, EmailSettingsCommandableGrpcServiceV1_1.EmailSettingsCommandableGrpcServiceV1);
        this.registerAsType(EmailSettingsServiceFactory.GrpcServiceDescriptor, EmailSettingsGrpcServiceV1_1.EmailSettingsGrpcServiceV1);
    }
}
exports.EmailSettingsServiceFactory = EmailSettingsServiceFactory;
EmailSettingsServiceFactory.Descriptor = new pip_services3_commons_nodex_1.Descriptor("service-emailsettings", "factory", "default", "default", "1.0");
EmailSettingsServiceFactory.MemoryPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-emailsettings", "persistence", "memory", "*", "1.0");
EmailSettingsServiceFactory.FilePersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-emailsettings", "persistence", "file", "*", "1.0");
EmailSettingsServiceFactory.MongoDbPersistenceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-emailsettings", "persistence", "mongodb", "*", "1.0");
EmailSettingsServiceFactory.ControllerDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-emailsettings", "controller", "default", "*", "1.0");
EmailSettingsServiceFactory.CmdHttpServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-emailsettings", "service", "commandable-http", "*", "1.0");
EmailSettingsServiceFactory.CommandableGrpcServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-emailsettings", "service", "commandable-grpc", "*", "1.0");
EmailSettingsServiceFactory.GrpcServiceDescriptor = new pip_services3_commons_nodex_1.Descriptor("service-emailsettings", "service", "grpc", "*", "1.0");
//# sourceMappingURL=EmailSettingsServiceFactory.js.map