/**
 * Currently Hapi doesn't recognize ES6 syntax on exports (ie: "default" keyword)
 *
 * @param {Object} obj
 * @returns {string}
 */
module.exports = (obj) => JSON.stringify(obj);
