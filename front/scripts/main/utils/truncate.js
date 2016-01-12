/**
 * @param {String} text
 * @param {Number} maxLength
 * @returns {string}
 */
export default function (text, maxLength = 48) {
	const ellipsisCharacter = '\u2026';

	let truncatedString,
		lastWhiteSpacePos;

	if (typeof text !== 'string') {
		Ember.Logger.error(`Truncate Util expected string as a parameter, but ${typeof text} given:`, text);
		return null;
	}

	if (text.length <= maxLength) {
		return text;
	}

	truncatedString = text.substr(0, maxLength);
	lastWhiteSpacePos = truncatedString.search(/\s[^\s]*$/);

	if (lastWhiteSpacePos === maxLength || lastWhiteSpacePos < 0) {
		return truncatedString + ellipsisCharacter;
	}

	return truncatedString.substr(0, lastWhiteSpacePos) + ellipsisCharacter;
}

