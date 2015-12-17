import App from '../app';

/**
 * @param {Array} params
 * @returns {string}
 */
export default App.TruncateHelper = Ember.Helper.helper((params) => {
	const text = params[0],
		maxLength = params[1] || 48,
		ellipsisCharacter = '\u2026';

	let truncatedString,
		lastSpacePosition;

	if (typeof text !== 'string') {
		Ember.Logger.error(`Truncate helper expected string as a parameter, but ${typeof text} given:`, text);
		return null;
	}

	if (text.length <= maxLength) {
		return text;
	}

	truncatedString = text.substr(0, maxLength);
	lastSpacePosition = truncatedString.lastIndexOf(' ');

	if (lastSpacePosition === maxLength || lastSpacePosition < 0) {
		return truncatedString + ellipsisCharacter;
	}

	return truncatedString.substr(0, lastSpacePosition) + ellipsisCharacter;
});
