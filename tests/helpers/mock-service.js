import {registerHelper} from '@ember/test';

export default registerHelper('mockService', (app, newService, serviceName) => {
	const instance = app.__deprecatedInstance__,
		registry = instance.register ? instance : instance.registry;
debugger;
	return registry.register(`service:${serviceName}`, newService);
});
