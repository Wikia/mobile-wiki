import App from '../app';

/**
 * Check if two arguments are equals
 *
 * @param {Array} params
 * @returns {string}
 */
App.EqualHelper = Ember.Helper.helper((params) => {
	return params[0] === params[1];
});
