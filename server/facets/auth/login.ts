/// <reference path='../../../typings/hapi/hapi.d.ts' />
import authUtils = require('../../lib/AuthUtils');
import localSettings = require('../../../config/localSettings');
import authView = require('./authView');
var deepExtend = require('deep-extend');

interface LoginViewContext extends authView.AuthViewContext {
	headerText: string;
	forgotPasswordHref?: string;
	formErrorKey?: string;
	heliosLoginURL: string;
}

function getLoginViewContext (request: Hapi.Request, redirect: string): LoginViewContext {
	return deepExtend(
		authView.getDefaultContext(request),
		{
			title: 'auth:login.login-title',
			headerText: 'auth:login.welcome-back',
			footerCallout: 'auth:login.register-callout',
			footerCalloutLink: 'auth:login.register-now',
			footerHref: authUtils.getSignupUrlFromRedirect(redirect),
			forgotPasswordHref: authUtils.getForgotPasswordUrlFromRedirect(redirect),
			bodyClasses: 'login-page',
			heliosLoginURL: localSettings.helios.host + '/token'
		}
	);
}

export function get (request: Hapi.Request, reply: any): Hapi.Response {
	var redirect: string = authView.getRedirectUrl(request),
		context: LoginViewContext = getLoginViewContext(request, redirect);

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirect);
	}

	return authView.view('login', context, request, reply);
}
