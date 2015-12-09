import App from '../app';

/**
 * Formats a number of seconds into a duration, in the form HH:MM:SS
 *
 * @param {Array} params
 * @returns {string}
 */
App.EqualHelper = Ember.Helper.helper((params) => {
	return params[0] === params[1];
});
