var Logger = require('../../server/lib/Logger');

module.exports = function (language) {
	var translations = {},
		defaultLanguage = 'en';

	[language, defaultLanguage].some(function (lang) {
		var translationPath = '../../front/locales/' + lang + '/translation.json';
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
	return JSON.stringify(translations);
};
