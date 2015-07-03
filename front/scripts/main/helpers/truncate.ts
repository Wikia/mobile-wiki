/// <reference path="../app.ts" />

Em.Handlebars.registerBoundHelper('truncate', function (string: string, maxLength: number = 48): string {
	var truncatedString: string,
		lastSpacePosition: number,
		ellipsisCharacter: string = '\u2026';

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
