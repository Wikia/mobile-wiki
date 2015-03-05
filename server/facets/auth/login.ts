/// <reference path='../../../typings/wreck/wreck.d.ts' />
/// <reference path='../../../config/localSettings.d.ts' />
import Wreck = require('wreck');
import localSettings = require('../../../config/localSettings');
import qs = require('querystring');

interface AuthParams {
	'user_id'       : string;
	'access_token'  : string;
	'refresh_token' : string;
	redirect?       : string;
}

function authenticate (username: string, password: string, callback): void {
	Wreck.get(localSettings.helios.host + '/token?' + qs.stringify({
		'grant_type'    : 'password',
		'client_id'     : localSettings.helios.id,
		'client_secret' : localSettings.helios.secret,
		'username'      : username,
		'password'      : password
	}), (err, response, payload) => {
		var parsed = JSON.parse(payload);
		if (parsed.error) {
			return callback(parsed.error);
		}
		callback(null, parsed);
	});
}


function login (request, reply): void {
	var method: string = request.method,
		credentials: any = request.payload,
		authParams: AuthParams,
		error: any = {};

	if (request.auth.isAuthenticated) {
		console.log('foo', request.query.redirect);
		return reply.redirect(request.query.redirect || '/');
	}

	if (method === 'post') {
		authenticate(credentials.username, credentials.password, (err, response) => {
			if (err) {
				error.message = err;
				return reply.view('login', error, {
					layout: 'wikia-static'
				});
			}

			authParams = {
				'user_id'       : response.user_id,
				'access_token'  : response.access_token,
				'refresh_token' : response.refresh_token
			};

			if (request.query.redirect) {
				authParams.redirect = request.query.redirect;
			}

			return reply.redirect('/auth?' + qs.stringify(authParams));
		});
	}

	if (method === 'get') {
		return reply.view('login', null, {
			layout: 'wikia-static'
		});
	}
}

export = login;
