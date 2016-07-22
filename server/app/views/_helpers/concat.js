/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 * Accepts any number of string params to join.
 *
 * @param {*} strings Array of strings passed to helper,
 * 					  the last one is an object passed by Handlebars
 * @returns {string}
 */
module.exports = function (...strings) {
	strings.pop();
	return strings.join('');
};
