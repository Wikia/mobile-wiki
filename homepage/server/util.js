/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var fs = require('fs'),
	path = require('path');

exports.readJsonConfigSync = function (filename) {
	try {
		var f = path.resolve(__dirname, filename),
			data = fs.readFileSync(f, 'utf8');

		return JSON.parse(data);
	}
	catch (e) {
		console.log(e);
		return null;
	}
};

exports.getUserLocale = function (/*request*/) {
	// TODO: Parse accept-language and login state to set locale
	return 'ja';
};

exports.getLocalizedHubData = function (hubConfig, locale) {
	var arr = hubConfig.data,
		i,
		item;

	for (i in arr) {
		item = arr[i];

		if (item.locale === locale) {
			return item.assets;
		}
	}

	return null;
};
