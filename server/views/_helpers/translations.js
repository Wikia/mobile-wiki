var Logger = require('../../lib/Logger');

module.exports = function (language) {
	var translations = {},
		translationPath,
		fallbackLanguage = language.split('-')[0],
		defaultLanguage = 'en',
		foundLanguage = '',
		response = {};

	[language, fallbackLanguage, defaultLanguage].some(function (lang) {
		foundLanguage = lang;
		translationPath = '../../../front/locales/' + lang + '/translation.json';
		
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

	response[foundLanguage] = translations;
	return response;
};
