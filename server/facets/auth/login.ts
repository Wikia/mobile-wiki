/// <reference path='../../../typings/hapi/hapi.d.ts' />
import authUtils = require('../../lib/AuthUtils');
import localSettings = require('../../../config/localSettings');

interface LoginViewContext {
	title: string;
	headerText: string;
	footerCallout: string;
	footerCalloutLink: string;
	language: string;
	footerHref?: string;
	forgotPasswordHref?: string;
	hideHeader?: boolean;
	hideFooter?: boolean;
	exitTo?: string;
	bodyClasses?: string;
	formErrorKey?: string;
	heliosLoginURL: string;
}

function getLoginContext (request: Hapi.Request, redirect: string): LoginViewContext {
	return <LoginViewContext> {
		title: 'auth:login.login-title',
		headerText: 'auth:login.welcome-back',
		footerCallout: 'auth:login.register-callout',
		footerCalloutLink: 'auth:login.register-now',
		heliosLoginURL: localSettings.helios.host + '/token',
		language: request.server.methods.i18n.getInstance().lng(),
		exitTo: redirect,
		footerHref: authUtils.getSignupUrlFromRedirect(redirect),
		forgotPasswordHref: authUtils.getForgotPasswordUrlFromRedirect(redirect)
	};
}

export function get (request: Hapi.Request, reply: any): void {
	var redirect: string = request.query.redirect || '/',
		context: LoginViewContext = getLoginContext(request, redirect);

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirect);
	}

	return reply.view('login', context, {
		layout: 'auth'
	});
}

