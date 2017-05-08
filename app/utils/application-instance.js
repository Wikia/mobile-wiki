// Ember application instance that can be imported into any file.
// Useful for container lookups in files outside of the usual hierarchy.
/**
 * @deprecated Don't use it on server-side. It leaks state between requests
 */
const application = {
	instance: null
};

export default application;

/**
 * @deprecated Don't use it on server-side. It leaks state between requests
 */
export const getService = (service) => {
	return application.instance.lookup(`service:${service}`);
};
