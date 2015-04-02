var Logger = require('../../lib/Logger');

module.exports = function (language, opts) {
	var translations = {},
		translationPath,
		fallbackLanguage = language.split('-')[0],
		defaultLanguage = 'en',
		foundLanguage = '',
		namespace = opts.hash.ns || 'main',
		wrapper = {};

	[language, fallbackLanguage, defaultLanguage].some(function (lang) {
		foundLanguage = lang;
		translationPath = '../../../front/locales/' + lang + '/' + namespace + '.json';

		try {
			translations = require(translationPath);
			return true;
		} catch (exception) {
			Logger.error({
				lang: lang,
				path: translationPath,
				error: exception.message
			}, 'Translation not found');
		}
	});

	wrapper[foundLanguage] = {};
	wrapper[foundLanguage][namespace] = translations;
	return wrapper;
};
