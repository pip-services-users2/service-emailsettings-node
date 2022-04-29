"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailSettingsFilePersistence = void 0;
const pip_services3_data_nodex_1 = require("pip-services3-data-nodex");
const EmailSettingsMemoryPersistence_1 = require("./EmailSettingsMemoryPersistence");
class EmailSettingsFilePersistence extends EmailSettingsMemoryPersistence_1.EmailSettingsMemoryPersistence {
    constructor(path) {
        super();
        this._persister = new pip_services3_data_nodex_1.JsonFilePersister(path);
        this._loader = this._persister;
        this._saver = this._persister;
    }
    configure(config) {
        super.configure(config);
        this._persister.configure(config);
    }
}
exports.EmailSettingsFilePersistence = EmailSettingsFilePersistence;
//# sourceMappingURL=EmailSettingsFilePersistence.js.map