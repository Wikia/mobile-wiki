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
	'redirect'?     : string;
	'remember'?     : string;
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

interface LoginViewContext {
	title        : string;
	hideHeader?  : boolean;
	hideFooter?  : boolean;
	exitTo?      : string;
	bodyClasses? : string;
	loadScripts? : boolean;
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
			/* tslint:disable:no-string-literal */
			return callback(Boom.unauthorized(parsed.error + ': ' + parsed['error_description']));
			/* tslint:enable:no-string-literal */
		}
		callback(null, parsed);
	});
}


export function get (request: Hapi.Request, reply: any): void {
	var context: LoginViewContext,
		redirectUrl: string = request.query.redirect || '/';

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = {
		exitTo: redirectUrl,
		title: 'Login',
		loadScripts: true
	};

	return reply.view('login', context, {
		layout: 'wikia-static'
	});
}

export function post (request: Hapi.Request, reply: any): void {
	var credentials: any = request.payload,
		authParams: AuthParams,
		requestedWithHeader: string = request.headers['x-requested-with'],
		isAJAX: boolean = requestedWithHeader && !!requestedWithHeader.match('XMLHttpRequest'),
		error: any = {},
		authRedirect: string,
		context: any = {
			error: null
		};

	authenticate(credentials.username, credentials.password, (err: Boom.BoomError, response: HeliosResponse) => {

		if (err) {
			/**
			 * Forward the error payload, not the entire object as the trace may contain
			 * sensitive information
			 */
			context.error = err.output.payload;

			if (isAJAX) {
				return reply(context).code(err.output.statusCode);
			}

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

		if (credentials.remember) {
			authParams.remember = '1';
		}

		authRedirect = '/auth?' + qs.stringify(authParams);

		if (isAJAX) {
			return reply({authRedirect: authRedirect});
		}

		return reply.redirect(authRedirect);
	});
}
