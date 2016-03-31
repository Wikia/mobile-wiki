/**
 * @param {Object} obj
 * @returns {Object}
 */
module.exports = function (obj) {
	return JSON.parse(JSON.stringify(obj));
};
