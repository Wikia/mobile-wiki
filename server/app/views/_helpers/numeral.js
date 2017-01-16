/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 *
 * Handlebars helper that wrap numeral library
 *
 * @see Copy of front/main/app/helpers/numeral.js
 *
 * @param {Number} number
 * @param {String} format
 * @returns {string}
 */
module.exports = function (number, format) {
	return this.numeral(number).format(format);
};
