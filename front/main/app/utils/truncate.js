/**
 * @param {String} text
 * @param {Number} maxLength
 * @returns {string}
 */
export function truncate(text, maxLength = 48) {
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

/**
 * @desc Provides information about whether it is need to use truncation hack as a cover fort the line-clamp css
 * property. Method returns true only in Firefox and in IE, because in other browsers 'line-clamp' css property works.
 *
 * @returns {Boolean}
 */
export function shouldUseTruncationHack() {
	return (/Firefox|Trident|Edge/).test(navigator.userAgent);
}
