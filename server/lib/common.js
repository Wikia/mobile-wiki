/// <reference path="../../typings/q/Q.d.ts" />
var Q = require('q');

/**
* Creates promise for callback function
*
* @param {function} callback
* @returns {object}
*/
var common;
(function (common) {
    function promisify(callback) {
        var deferred = Q.defer();
        callback(deferred);
        return deferred.promise;
    }
    common.promisify = promisify;
})(common || (common = {}));

module.exports = common;
