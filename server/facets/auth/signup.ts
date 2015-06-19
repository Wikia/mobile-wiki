/// <reference path='../../../config/localSettings.d.ts' />
import localSettings = require('../../../config/localSettings');

interface SignupViewContext {
	title: string;
	language: string;
	headerText?: string;
	exitTo?: string;
	bodyClasses?: string;
	loadScripts?: boolean;
	i18nContext?: any;
	footerLinkRoute?: string;
	footerCalloutText?: string;
	footerCalloutLink?: string;
	heliosRegistrationURL?: string;
	termsOfUseLink?: string;
	footerHref?: string;
	usernameMaxLength?: number;
	passwordMaxLength?: number;
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
		heliosRegistrationURL: localSettings.helios.host + '/register',
		usernameMaxLength: localSettings.helios.usernameMaxLength,
		passwordMaxLength: localSettings.helios.passwordMaxLength,
		title: 'auth:join.sign-up-with-email',
		language: request.server.methods.i18n.getInstance().lng(),
		loadScripts: true,
		termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
		footerCallout: 'auth:common.login-callout',
		footerCalloutLink: 'auth:common.login-link-text',
		footerHref: '/login?redirect=' + encodeURIComponent(redirectUrl)
	};

	return reply.view('signup', context, {
		layout: 'auth'
	});
}
