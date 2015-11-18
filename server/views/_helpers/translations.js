var Logger = require('../../lib/Logger');

module.exports = function (language, opts) {
	var translations = {},
		translationPath,
		fallbackLanguage = language.split('-')[0],
		defaultLanguage = 'en',
		foundLanguage = '',
		namespace,
		wrapper = {};

	namespace = (opts.hash.ns instanceof Array) ? opts.hash.ns : [opts.hash.ns];

	namespace.forEach(function (ns) {
		[language, fallbackLanguage, defaultLanguage].some(function (lang) {
			foundLanguage = lang;
			translationPath = '../../../front/locales/' + lang + '/' + ns + '.json';

			try {
				translations = require(translationPath);
				return true;
			} catch (exception) {
				Logger.error({
					lang: lang,
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
