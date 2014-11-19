var Logger = require('../../server/lib/Logger');

module.exports = function (language) {
	var translations = {},
		defaultLanguage = 'en';

	[language, defaultLanguage].forEach(function (lang) {
		var translationPath = '../../public/locales/' + lang + '/translation.json';
		try {
			translations = require(translationPath);
			return JSON.stringify(translations);
		} catch (exception) {
			Logger.error({lang: lang, path: translationPath}, 'Translation not found');
		}
	});
	return JSON.stringify(translations);
};
