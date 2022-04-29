import { Factory } from 'pip-services3-components-nodex';
import { Descriptor } from 'pip-services3-commons-nodex';

import { EmailSettingsMongoDbPersistence } from '../persistence/EmailSettingsMongoDbPersistence';
import { EmailSettingsFilePersistence } from '../persistence/EmailSettingsFilePersistence';
import { EmailSettingsMemoryPersistence } from '../persistence/EmailSettingsMemoryPersistence';
import { EmailSettingsController } from '../logic/EmailSettingsController';
import { EmailSettingsHttpServiceV1 } from '../services/version1/EmailSettingsHttpServiceV1';
import { EmailSettingsCommandableGrpcServiceV1 } from '../services/version1/EmailSettingsCommandableGrpcServiceV1';
import { EmailSettingsGrpcServiceV1 } from '../services/version1/EmailSettingsGrpcServiceV1';

export class EmailSettingsServiceFactory extends Factory {
	public static Descriptor = new Descriptor("service-emailsettings", "factory", "default", "default", "1.0");
	public static MemoryPersistenceDescriptor = new Descriptor("service-emailsettings", "persistence", "memory", "*", "1.0");
	public static FilePersistenceDescriptor = new Descriptor("service-emailsettings", "persistence", "file", "*", "1.0");
	public static MongoDbPersistenceDescriptor = new Descriptor("service-emailsettings", "persistence", "mongodb", "*", "1.0");
	public static ControllerDescriptor = new Descriptor("service-emailsettings", "controller", "default", "*", "1.0");
	public static HttpServiceDescriptor = new Descriptor("service-emailsettings", "service", "http", "*", "1.0");
	public static CommandableGrpcServiceDescriptor = new Descriptor("service-emailsettings", "service", "commandable-grpc", "*", "1.0");
	public static GrpcServiceDescriptor = new Descriptor("service-emailsettings", "service", "grpc", "*", "1.0");
	
	constructor() {
		super();
		this.registerAsType(EmailSettingsServiceFactory.MemoryPersistenceDescriptor, EmailSettingsMemoryPersistence);
		this.registerAsType(EmailSettingsServiceFactory.FilePersistenceDescriptor, EmailSettingsFilePersistence);
		this.registerAsType(EmailSettingsServiceFactory.MongoDbPersistenceDescriptor, EmailSettingsMongoDbPersistence);
		this.registerAsType(EmailSettingsServiceFactory.ControllerDescriptor, EmailSettingsController);
		this.registerAsType(EmailSettingsServiceFactory.HttpServiceDescriptor, EmailSettingsHttpServiceV1);
		this.registerAsType(EmailSettingsServiceFactory.CommandableGrpcServiceDescriptor, EmailSettingsCommandableGrpcServiceV1);
		this.registerAsType(EmailSettingsServiceFactory.GrpcServiceDescriptor, EmailSettingsGrpcServiceV1);
	}
	
}
