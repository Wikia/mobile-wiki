define('mobile-wiki/utils/truncate', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = truncate;
	/**
  * @param {String} text
  * @param {Number} maxLength
  * @returns {string}
  */
	function truncate(text) {
		var maxLength = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 48;

		var ellipsisCharacter = '\u2026';

		var truncatedString = void 0,
		    lastWhiteSpacePos = void 0;

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
});