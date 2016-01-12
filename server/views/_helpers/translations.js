import Logger from '../../lib/Logger';

/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 *
 * @param {string} language
 * @param {{hash: string}} opts
 * @returns {{}}
 */
module.exports = function (language, opts) {
	const fallbackLanguage = language.split('-')[0],
		defaultLanguage = 'en',
		wrapper = {},
		namespace = (opts.hash.ns instanceof Array) ? opts.hash.ns : [opts.hash.ns];

	let translations = {},
		foundLanguage;

	namespace.forEach((ns) => {
		[language, fallbackLanguage, defaultLanguage].some((lang) => {
			const translationPath = `../../../front/locales/${lang}/${ns}.json`;

			foundLanguage = lang;

			try {
				translations = require(translationPath);
				return true;
			} catch (exception) {
				Logger.error({
					lang,
					namespace: ns,
					path: translationPath,
					error: exception.message
				}, 'Translation not found');
			}
		});

		if (!wrapper.hasOwnProperty(foundLanguage)) {
			wrapper[foundLanguage] = {};
		}

		wrapper[foundLanguage][ns] = translations;
	});

	return wrapper;
};
