/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 *
 * Checks if two provided params are equal
 *
 * @param {*} param1
 * @param {*} param2
 * @returns {string}
 */
module.exports = function equal(param1, param2) {
	return param1 === param2;
};
