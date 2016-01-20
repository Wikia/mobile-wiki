/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 *
 * @param {string} key
 * @param {{hash: string}} options
 * @returns {string}
 */
module.exports = function i18nHelper(key, options) {
	const translateWithCache = this.i18n.translateWithCache,
		params = {},
		instance = this.i18n.getInstance(),
		// Hash object is created from parameters passed into i18n tag (i.e. foo=bar or template context).
		hash = options.hash;

	let namespace = '';

	Object.keys(hash).forEach((key) => {
		if (key === 'ns') {
			namespace = `${hash[key]}:`;
		} else {
			params[key] = String(hash[key]);
		}
	});

	return translateWithCache(namespace + key, instance.lng(), params);
};
