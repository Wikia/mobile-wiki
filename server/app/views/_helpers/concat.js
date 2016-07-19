/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 * Accepts any number of string params to join.
 *
 * @returns {string}
 */
module.exports = function concat() {
	return Array.prototype.slice.call(arguments, 0, -1).join('');
};
