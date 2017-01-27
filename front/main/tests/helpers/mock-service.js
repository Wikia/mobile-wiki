import Ember from 'ember';

export default Ember.Test.registerHelper('mockService', (app, newService, serviceName) => {
	const instance = app.__deprecatedInstance__,
		registry = instance.register ? instance : instance.registry;

	return registry.register(`service:${serviceName}`, newService);
});
