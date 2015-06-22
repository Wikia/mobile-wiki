/// <reference path='../../../typings/hapi/hapi.d.ts' />
/// <reference path='./BirthdateInput.ts' />
/// <reference path='../../../config/localSettings.d.ts' />

import BirthdateInput = require('./BirthdateInput');
import dateUtils = require('../../lib/DateUtils');
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
	birthdateInputs: Array<InputData>;
	heliosRegistrationURL?: string;
	termsOfUseLink?: string;
}

export function get (request: Hapi.Request, reply: any): void {
	var context: SignupViewContext,
		redirectUrl: string = request.query.redirect || '/',
		i18n = request.server.methods.i18n.getInstance(),
		lang = i18n.lng();

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = {
		exitTo: redirectUrl,
		headerText: 'auth:join.sign-up-with-email',
		heliosRegistrationURL: localSettings.helios.host + '/register',
		title: 'auth:join.sign-up-with-email',
		language: request.server.methods.i18n.getInstance().lng(),
		loadScripts: true,
		termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
		footerLinkRoute: '/login?redirect=' + encodeURIComponent(redirectUrl),
		footerCallout: 'auth:common.login-callout',
		footerCalloutLink: 'auth:common.login-link-text',
		birthdateInputs: (new BirthdateInput(dateUtils.get('endian', lang), lang)).getInputData()
	};

	return reply.view('signup', context, {
		layout: 'auth'
	});
}
