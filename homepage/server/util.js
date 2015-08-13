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
		return null;
	}
};

exports.getUserLocale = function (/*request*/) {
	// TODO: Parse accept-language and login state to set locale
	return 'ja';
};

exports.getLoginState = function (/*request*/) {
	// TODO: Parse access_token cookie from Helios
	return false;
};

exports.getUserName = function (/*request*/) {
	// TODO: Parse access_token cookie form Helios and get user information
	return 'Test';
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

// Knuth shuffle: http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
function shuffle(array) {
	var currentIndex = array.length, temporaryValue, randomIndex ;

	while (0 !== currentIndex) {
		randomIndex = Math.floor(Math.random() * currentIndex);
		currentIndex -= 1;

		temporaryValue = array[currentIndex];
		array[currentIndex] = array[randomIndex];
		array[randomIndex] = temporaryValue;
	}

	return array;
}

exports.preprocessPopularData = function (popular) {
	var i;

	// Randomize array contents
	popular.data = shuffle(popular.data);

	for (i = 0; i < popular.data.length; i++) {
		// Set layout parameter according to pattern defined in popular.layout
		var layout = popular.layout[i % popular.layout.length];

		popular.data[i].layout = layout;

		// Set image for large screen
		if (layout === 'grid-item-big') {
			popular.data[i].imageLarge = popular.data[i].imageBaseUrl + popular.data[i].imageWide;
		} else {
			popular.data[i].imageLarge = popular.data[i].imageBaseUrl + popular.data[i].imageNarrow;
		}

		popular.data[i].imageSmall = popular.data[i].imageBaseUrl + popular.data[i].imageNarrow;
	}

	return popular.data;
};
