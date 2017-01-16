import Logger from '../../lib/logger';

/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 *
 * Truncate input string and add ellipsis if needed
 *
 * @see Copy of front/main/app/utils/truncate.js
 *
 * @param {String} text
 * @param {Integer} maxLength
 * @returns {string}
 */
module.exports = function truncate(text, maxLength = 48) {
	const ellipsisCharacter = '\u2026';

	let truncatedString,
		lastWhiteSpacePos;

	if (typeof text !== 'string') {
		Logger.error(`Truncate Util expected string as a parameter, but ${typeof text} given:`, text);
		return null;
	}

	if (text.length <= maxLength) {
		return text;
	}

	truncatedString = text.substr(0, maxLength);
	lastWhiteSpacePos = truncatedString.search(/\s[^\s]*$/);

	if (lastWhiteSpacePos < 0) {
		return truncatedString + ellipsisCharacter;
	}

	return truncatedString.substr(0, lastWhiteSpacePos) + ellipsisCharacter;
};
