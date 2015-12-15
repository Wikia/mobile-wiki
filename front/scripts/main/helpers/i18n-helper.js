import App from '../app';

/**
 * @param {Array} params
 * @param {Object} options
 * @returns {string}
 */
export default App.I18nHelper = Ember.Helper.helper((params, options) => {
	const i18nParams = {},
		value = params.join('.');

	let namespace = 'main';

	/**
	 * @param {string} key
	 * @returns {void}
	 */
	Object.keys(options).forEach((key) => {
		if (key === 'ns') {
			namespace = options[key];
		} else if (options.hasOwnProperty(key)) {
			i18nParams[key] = String(options[key]);
		}
	});

	return i18n.t(`${namespace}:${value}`, i18nParams);
});
