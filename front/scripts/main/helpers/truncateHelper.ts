/// <reference path="../app.ts" />

App.TruncateHelper = Em.Helper.helper(function (params: any[]): string {
	var string = params[0],
		maxLength = params[1],
		truncatedString: string,
		lastSpacePosition: number,
		ellipsisCharacter: string = '\u2026';

	if (typeof string !== 'string') {
		Em.Logger.error(`Truncate helper expected string as a parameter, but ${typeof string} given:`, string);
		return null;
	}

	if (string.length <= maxLength) {
		return string;
	}

	truncatedString = string.substr(0, maxLength);
	lastSpacePosition = truncatedString.lastIndexOf(' ');

	if (lastSpacePosition === maxLength || lastSpacePosition < 0) {
		return truncatedString + ellipsisCharacter;
	}

	return truncatedString.substr(0, lastSpacePosition) + ellipsisCharacter;
});
