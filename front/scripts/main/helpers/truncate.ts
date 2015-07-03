/// <reference path="../app.ts" />

Em.Handlebars.registerBoundHelper('truncate', function (string: string, maxLength: number = 48) {
	var truncatedString: string,
		lastSpacePosition: number;

	if (string.length <= maxLength) {
		return string;
	}

	truncatedString = string.substr(0, maxLength);
	lastSpacePosition = truncatedString.lastIndexOf(' ');

	if (lastSpacePosition === maxLength || lastSpacePosition < 0) {
		return truncatedString + '…';
	}

	return truncatedString.substr(0, lastSpacePosition) + '…';
});
