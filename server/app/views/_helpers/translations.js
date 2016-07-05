import Logger from '../../lib/logger';

/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 * Default value for language is set 'en' by default, to not perform 'split'
 * on null or undefined
 *
 * @param {string} [language='en']
 * @param {{hash: string}} [opts={}]
 * @returns {Object}
 */
module.exports = function (language = 'en', opts = {}) {
	const fallbackLanguage = language.split('-')[0],
		defaultLanguage = 'en',
		wrapper = {},
		namespace = (opts.hash.ns instanceof Array) ? opts.hash.ns : [opts.hash.ns];

	let translations = {},
		foundLanguage;

	namespace.forEach((ns) => {
		[language, fallbackLanguage, defaultLanguage].some((lang) => {
			const translationPath = `../../../../front/common/locales/${lang}/${ns}.json`;

			foundLanguage = lang;

			try {
				translations = require(translationPath);
				return true;
			} catch (exception) {
				if (lang === defaultLanguage) {
					Logger.fatal({
						lang,
						namespace: ns,
						path: translationPath,
						error: exception.message
					}, `Translation for default language (${defaultLanguage}) not found`);
				}
			}
		});

		if (!wrapper.hasOwnProperty(foundLanguage)) {
			wrapper[foundLanguage] = {};
		}

		wrapper[foundLanguage][ns] = translations;
	});

	return wrapper;
};
