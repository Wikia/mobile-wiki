var Logger = require('../../server/lib/Logger');

module.exports = function (language) {
	var translations;

	language = language || 'en';

	try {
		translations = require('../../public/locales/' + language + '/translation.json');
	} catch (exception) {
		Logger.error(exception);
		translations = {};
	}

	return JSON.stringify(translations);
};
