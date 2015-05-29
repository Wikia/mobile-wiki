/// <reference path='../../../config/localSettings.d.ts' />
import localSettings = require('../../../config/localSettings');

interface SignupViewContext {
	title: string;
	headerText?: string;
	exitTo?: string;
	bodyClasses?: string;
	loadScripts?: boolean;
	i18nContext?: any;
	footerLinkRoute?: string;
	footerCalloutText?: string;
	footerCalloutLink?: string;
}

export function get (request: Hapi.Request, reply: any): void {
	var context: SignupViewContext,
		redirectUrl: string = request.query.redirect || '/';

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = {
		exitTo: redirectUrl,
		headerText: 'auth:join.sign-up-with-email',
		heliosRegistrationURL: localSettings.helios.host + 'register',
		footer: 'auth:signup.footer',
		title: 'auth:join.sign-up-with-email',
		loadScripts: true,
		termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
		footerLinkRoute: '/login?redirect=' + encodeURIComponent(redirectUrl),
		footerCalloutText: 'auth:common.login-callout',
		footerCalloutLink: 'auth:common.login-link-text'
	};

	return reply.view('signup', context, {
		layout: 'auth'
	});
}
