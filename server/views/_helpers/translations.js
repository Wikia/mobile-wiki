var Logger = require('../../lib/Logger');

module.exports = function (language) {
	var translations = {},
		fallbackLanguage = language.split('-')[0],
		defaultLanguage = 'en',
		foundLanguage = '';

	[language, fallbackLanguage, defaultLanguage].some(function (lang) {
		console.log('language:', language)

		var translationPath = '../../../front/locales/' + lang + '/translation.json';
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
		//foundLanguage = lang;
	});
	//return {language: foundLanguage, translated: JSON.stringify(translations)};
	return JSON.stringify(translations);
};
