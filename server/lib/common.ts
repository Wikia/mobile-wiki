/// <reference path="../../typings/q/Q.d.ts" />
/// <reference path="../../typings/bluebird/bluebird.d.ts" />

import Q = require('q');
import Promise = require('bluebird');

/**
 * Creates promise for callback function
 *
 * @param {function} callback
 * @returns {object}
 */
module common {
	export function promisify(callback: (deferred: Q.Deferred<any>) => void): Q.Promise<any> {
		var deferred: Q.Deferred<any> = Q.defer();
		callback(deferred);
		return deferred.promise;
	}
}

export = common;
