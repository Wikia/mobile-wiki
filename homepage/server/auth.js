/**
 * Wikia (Japan) Homepage
 *
 * @author Per Johan Groland <pgroland@wikia-inc.com>
 */

var Promise = require('bluebird'),
	request = require('request'),
	querystring = require('querystring'),
	url = require('url'),
	localSettings = require('../config/localSettings').localSettings;

function Auth() {
	this.baseUrl     = url.resolve(localSettings.helios.host + '/', '.');
	this.servicesUrl = localSettings.servicesUrl;
	this.apiUrl      = localSettings.apiUrl;
}

function requestWrapper(url) {
	var deferred = Promise.defer();

	request.get(url, function (err, response, body) {
		if (err) {
			deferred.reject(err);
		} else {
			try {
				var json = JSON.parse(body);

				if (json.error) {
					deferred.reject(json);
				} else {
					deferred.resolve(json);
				}
			}
			catch (e) {
				deferred.resolve(body);
			}
		}
	});

	return deferred.promise;
}

Auth.prototype.login = function (username, password) {
	var address = url.resolve(this.baseUrl, 'token?' +
		querystring.stringify({username: username, password: password}));

	return requestWrapper(address);
};

Auth.prototype.info = function (token) {
	var address = url.resolve(this.baseUrl + '/', 'info?' +
		querystring.stringify({code: token, noblockcheck: 1}));

	return requestWrapper(address);
};

Auth.prototype.getUserInfo = function (heliosInfoResponse) {
	var address = url.resolve(this.apiUrl, 'User/Details/?' +
		querystring.stringify({ids: heliosInfoResponse.user_id})); // jshint ignore:line

	return requestWrapper(address);
};

Auth.prototype.getUserName = function (heliosInfoResponse) {
	var address = url.resolve(this.servicesUrl, 'user-attribute/user/' +
		heliosInfoResponse.user_id  + '/attr/username'); // jshint ignore:line

	return requestWrapper(address);
};

module.exports = Auth;
