import App from '../app';

/**
 * Formats a number of seconds into a duration, in the form HH:MM:SS
 *
 * @param {Array} params
 * @returns {string}
 */
export default App.DurationHelper = Ember.Helper.helper((params) => {
	const value = params[0],
		hours = Math.floor(value / 3600),
		minutes = Math.floor((value - (hours * 3600)) / 60),
		seconds = Math.floor(value - (hours * 3600) - (minutes * 60));

	let duration = '';

	// If duration is below 0 seconds it means corrupted data, we don't want to display it
	// Also return early for 0 seconds
	if (value <= 0) {
		return '00:00';
	}

	if (hours > 0) {
		duration += `${(hours < 10 ? '0' : '')}${hours}:`;
	}

	duration += `${(minutes < 10 ? '0' : '')}${minutes}:${(seconds < 10 ? '0' : '')}${seconds}`;

	return duration;
});
