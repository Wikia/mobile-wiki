/// <reference path='../../../typings/wreck/wreck.d.ts' />
/// <reference path='../../../config/localSettings.d.ts' />
/// <reference path='../../../typings/hapi/hapi.d.ts' />
/// <reference path='../../../typings/boom/boom.d.ts' />
import Boom = require('boom');
import Wreck = require('wreck');
import localSettings = require('../../../config/localSettings');
import qs = require('querystring');

interface AuthParams {
	'user_id'       : string;
	'access_token'  : string;
	'refresh_token' : string;
	redirect?       : string;
}

interface AuthCallbackFn {
	(error: Boom.BoomError, response?: any): Function
}

interface HeliosResponse {
	'user_id'            : string;
	'access_token'       : string;
	'refresh_token'      : string;
	'token_type'         : string;
	'expires_in'         : string;
	'error'?             : string;
	'error_description'? : string;
}

function authenticate (username: string, password: string, callback: AuthCallbackFn): void {
	Wreck.get(localSettings.helios.host + '/token?' + qs.stringify({
		'grant_type'    : 'password',
		'client_id'     : localSettings.helios.id,
		'client_secret' : localSettings.helios.secret,
		'username'      : username,
		'password'      : password
	}), (err: any, response: any, payload: string) => {
		var parsed: HeliosResponse,
			parseError: Error;

		try {
			parsed = JSON.parse(payload);
		} catch (e) {
			parseError = e;
		}

		// Detects an error with the connection
		if (err || parseError) {
			return callback(err || Boom.wrap(parseError));
		}

		// Helios sends back a 200 currently, denoting failure only in payload differences here
		if (parsed.error) {
			return callback(Boom.unauthorized(parsed.error + ': ' + parsed['error_description']));
		}
		callback(null, parsed);
	});
}


function login (request: Hapi.Request, reply: any): void {
	var method: string = request.method,
		credentials: any = request.payload,
		authParams: AuthParams,
		error: any = {},
		context: any = {
			error: null
		};

	if (request.auth.isAuthenticated) {
		return reply.redirect(request.query.redirect || '/');
	}

	if (method === 'post') {
		authenticate(credentials.username, credentials.password, (err: Boom.BoomError, response: HeliosResponse) => {

			if (err) {
				/**
				 * Forward the error payload, not the entire object as the trace may contain
				 * sensitive information
				 */
				context.error = err.output.payload;

				return reply.view('login', context, {
					layout: 'wikia-static'
				// Always set the correct code
				}).code(err.output.statusCode);
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
		return reply.view('login', context, {
			layout: 'wikia-static'
		});
	}
}

export = login;
