/// <reference path="../../definitions/q/Q.d.ts" />

import Q = require('q');

/**
 * Creates promise for callback function
 *
 * @param {function} callback
 * @returns {object}
 */
module common {
	export function promisify(callback: (deferred: Q.Deferred<any>)=>void): Q.Promise<any> {
		var deferred: Q.Deferred<any> = Q.defer();
		callback(deferred);
		return deferred.promise;
	}
}

export = common;
