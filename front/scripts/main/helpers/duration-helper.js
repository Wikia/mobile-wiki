import App from '../app';

/**
 * Formats a number of seconds into a duration, in the form HH:MM:SS
 *
 * @param {Array} params
 * @returns {string}
 */
App.DurationHelper = Ember.Helper.helper((params) => {
	const value = params[0],
		hours = Math.floor(value / 3600),
		minutes = Math.floor((value - (hours * 3600)) / 60),
		seconds = Math.floor(value - (hours * 3600) - (minutes * 60));

	let duration = '';

	if (hours > 0) {
		duration += `${(hours < 10 ? '0' : '')}${hours}:`;
	}

	duration += `${(minutes < 10 ? '0' : '')}${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;

	return duration;
});
