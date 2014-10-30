/// <reference path="../app.ts" />

/**
 * @desc Formats a number of seconds into a duration, in the form HH:MM:SS
 */
Em.Handlebars.registerBoundHelper('duration', function (value: number, options: any) {
	var hours: number,
		minutes: number,
		seconds: number,
		duration = '';

	hours = Math.floor(value / 3600);
	minutes = Math.floor((value - (hours * 3600)) / 60);
	seconds = value - (hours * 3600) - (minutes * 60);

	if (hours > 0) {
		duration += (hours < 10 ? '0' : '') + hours + ':';
	}
	duration += (minutes < 10 ? '0' : '') + minutes + ':';
	duration += (seconds < 10 ? '0' : '') + seconds;

	return duration;
});
