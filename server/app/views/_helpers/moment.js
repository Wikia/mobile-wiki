import Logger from '../../lib/Logger';

module.exports = function (lang) {
	const sourcePath = `../../../../front/vendor/moment/locale/pl.js`;
	//doesnt work const sourcePath = `../../../../front/common/locales/momentjs/pl.js`;
	// Wroking const sourcePath = `../../../../front/common/locales/pl/auth.json`;
	let source;

	try {
		source = require(sourcePath);
		return true;
	} catch (exception) {
		Logger.error({
			lang,
			path: sourcePath,
			error: exception.message
		}, 'Translation for momentjs not found');
		//source = {};
		source = sourcePath;
	}
	return source;
};
