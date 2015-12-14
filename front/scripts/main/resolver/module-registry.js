/*globals requirejs, require */

if (typeof requirejs.entries === 'undefined') {
	requirejs.entries = requirejs._eak_seen;
}

function ModuleRegistry(entries) {
	this._entries = entries || requirejs.entries;
}

ModuleRegistry.prototype.moduleNames = function ModuleRegistry_moduleNames() {
	return (Object.keys || Ember.keys)(this._entries);
};

ModuleRegistry.prototype.has = function ModuleRegistry_has(moduleName) {
	return moduleName in this._entries;
};

ModuleRegistry.prototype.get = function ModuleRegistry_get(moduleName, exportName = 'default') {
	let module = mrequire(moduleName);
	return module && module[exportName];
};

export default ModuleRegistry;
