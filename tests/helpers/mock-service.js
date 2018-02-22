import {registerHelper} from '@ember/test';

export default registerHelper('mockService', (app, newService, serviceName) => {
	const instance = app.__deprecatedInstance__,
		registry = instance.register ? instance : instance.registry;

	return registry.register(`service:${serviceName}`, newService);
});
