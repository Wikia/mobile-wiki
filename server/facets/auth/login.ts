/// <reference path='../../../typings/wreck/wreck.d.ts' />
/// <reference path='../../../config/localSettings.d.ts' />
import Wreck = require('wreck');
import localSettings = require('../../../config/localSettings');
import qs = require('querystring');

function authenticate (username, password, callback) {
	Wreck.get(localSettings.helios.host + '/token?' + qs.stringify({
		'grant_type': 'password',
		'client_id': localSettings.helios.id,
		'client_secret': localSettings.helios.secret,
		'username': username,
		'password': password
	}), (err, response, payload) => {
		var parsed = JSON.parse(payload);
		if (parsed.error) {
			return callback(parsed.error, false);
		}
		callback(null, true, parsed);
	});
}


function login (request, reply) {
	var method = request.method,
		credentials = request.payload,
		error: any = {};

	console.log(request.auth);
	if (request.auth.isAuthenticated) {
		console.log('foo', request.query.redirect);
		return reply.redirect(request.query.redirect || '/');
	}

	if (method === 'post') {
		authenticate(credentials.username, credentials.password, (err, isValid, response) => {
			if (err) {
				error.message = err;
				return reply.view('login', error, {
					layout: 'wikia-static'
				});
			}

			request.auth.session.set(response);
			return reply.redirect(request.query.redirect || '/');
		});
	}

	if (method === 'get' || Object.keys(error).length) {
		return reply.view('login', null, {
			layout: 'wikia-static'
		});
	}

}

export = login;
