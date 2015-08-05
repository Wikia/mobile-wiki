/// <reference path='../../../typings/hapi/hapi.d.ts' />
/// <reference path='./BirthdateInput.ts' />
/// <reference path='../../../config/localSettings.d.ts' />

import BirthdateInput = require('./BirthdateInput');
import dateUtils = require('../../lib/DateUtils');
import authUtils = require('../../lib/AuthUtils');
import localSettings = require('../../../config/localSettings');
import authView = require('./authView');
var deepExtend = require('deep-extend');

interface RegisterViewContext extends authView.AuthViewContext {
	birthdateInputs: Array<InputData>;
	langCode: string;
	passwordMaxLength: number;
	usernameMaxLength: number;
	headerText?: string;
	heliosRegistrationURL?: string;
	i18nContext?: any;
	termsOfUseLink?: string;
}


interface RegisterFBViewContext extends authView.AuthViewContext {

	birthdateInputs: Array<InputData>;
	defaultBirthdate: string;
	headerSlogan: string;
	langCode: string;
	passwordMaxLength: number;
	usernameMaxLength: number;
	headerText?: string;
	heliosFacebookRegistrationURL?: string;
	i18nContext?: any;
	termsOfUseLink?: string;

}

function getFacebookRegistrationPage (request: Hapi.Request, reply: any): Hapi.Response {
	var context: RegisterFBViewContext,
		redirectUrl: string = authView.getRedirectUrl(request),
		i18n = request.server.methods.i18n.getInstance(),
		lang = i18n.lng();

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = deepExtend(
		authView.getDefaultContext(request),
		{
			headerText: 'auth:fb-register.register-with-facebook',
			heliosFacebookRegistrationURL: localSettings.helios.host + '/facebook/users',
			title: 'auth:fb-register.register-with-facebook',
			termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
			footerCallout: 'auth:common.signin-callout',
			footerHref: authUtils.getSignInUrl(request),
			footerCalloutLink: 'auth:fb-register.footer-callout-link',
			bodyClasses: 'register-fb-page',
			usernameMaxLength: localSettings.helios.usernameMaxLength,
			passwordMaxLength: localSettings.helios.passwordMaxLength,
			langCode: lang,
			facebookAppId: localSettings.facebook.appId,
			defaultBirthdate: '1970-01-01',
			headerSlogan: 'auth:fb-register.facebook-registration-info'
		}
	);

	return authView.view('register-fb', context, request, reply);
}

function getEmailRegistrationPage (request: Hapi.Request, reply: any): Hapi.Response {
	var context: RegisterViewContext,
		redirectUrl: string = authView.getRedirectUrl(request),
		i18n = request.server.methods.i18n.getInstance(),
		lang = i18n.lng();

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = deepExtend(
		authView.getDefaultContext(request),
		{
			headerText: 'auth:join.sign-up-with-email',
			heliosRegistrationURL: localSettings.helios.host + '/users',
			title: 'auth:join.sign-up-with-email',
			termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
			footerCallout: 'auth:common.signin-callout',
			footerHref: authUtils.getSignInUrl(request),
			footerCalloutLink: 'auth:common.signin-link-text',
			birthdateInputs: (new BirthdateInput(dateUtils.get('endian', lang), lang)).getInputData(),
			bodyClasses: 'register-page',
			usernameMaxLength: localSettings.helios.usernameMaxLength,
			passwordMaxLength: localSettings.helios.passwordMaxLength,
			langCode: lang
		}
	);

	return authView.view('register', context, request, reply);
}

export function get (request: Hapi.Request, reply: any): void {
	if (request.query.method === 'facebook') {
		getFacebookRegistrationPage(request, reply);
	} else {
		getEmailRegistrationPage(request, reply);
	}
}
