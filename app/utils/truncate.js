/**
 * @param {String} text
 * @param {Number} maxLength
 * @returns {string}
 */
export default function truncate(text, maxLength = 48) {
	const ellipsisCharacter = '\u2026';

	let truncatedString,
		lastWhiteSpacePos;

	if (typeof text !== 'string') {
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
}
