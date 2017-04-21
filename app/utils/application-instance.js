// Ember application instance that can be imported into any file.
// Useful for container lookups in files outside of the usual hierarchy.
const application = {
	instance: null
};

export default application;

export const getService = (service) => {
	return application.instance.lookup(`service:${service}`);
};
