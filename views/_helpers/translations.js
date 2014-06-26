module.exports = function (language) {
	language = language || 'en';

	var translations;

	try {
		translations = require('../../public/locales/' + language + '/translation.json');
	} catch (exception) {
		translations = {};
	}

	return JSON.stringify(translations);
};
