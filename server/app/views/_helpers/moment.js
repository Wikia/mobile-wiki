import Logger from '../../lib/Logger';

module.exports = function (lang) {
	if (lang !== 'en') {
		const sourcePath = `../../../../front/common/locales/moment/${lang}.json`;
		let translation;

		try {
			translation = require(sourcePath);
		} catch (exception) {
			Logger.error({
				lang,
				path: sourcePath,
				error: exception.message
			}, 'Translation for momentjs not found');
			translation = {};
		}
		return translation;
	}
};
