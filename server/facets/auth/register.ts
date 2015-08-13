/// <reference path='../../../typings/hapi/hapi.d.ts' />
/// <reference path='./BirthdateInput.ts' />
/// <reference path='../../../config/localSettings.d.ts' />

import BirthdateInput = require('./BirthdateInput');
import authUtils = require('../../lib/AuthUtils');
import dateUtils = require('../../lib/DateUtils');
import localSettings = require('../../../config/localSettings');
import localeSettings = require('../../../config/localeSettings');
import authView = require('./authView');
var deepExtend = require('deep-extend');

interface RegisterViewContext extends authView.AuthViewContext {
	birthdateInputs: Array<InputData>;
	headerText?: string;
	heliosRegistrationURL?: string;
	i18nContext?: any;
	termsOfUseLink?: string;
}


interface RegisterFBViewContext extends authView.AuthViewContext {

	birthdateInputs: Array<InputData>;
	defaultBirthdate: string;
	headerSlogan: string;
	headerText?: string;
	heliosFacebookRegistrationURL?: string;
	i18nContext?: any;
	termsOfUseLink?: string;
}

interface DefaultRegistrationContext {
	usernameMaxLength: number;
	passwordMaxLength: number;
	langCode: string;
	defaultBirthdate: string;
	pageParams: any;
}

function getDefaultRegistrationContext (request: Hapi.Request, i18n: any): DefaultRegistrationContext {
	var lang = i18n.lng();

	return deepExtend(authView.getDefaultContext(request),
		{
			usernameMaxLength: localSettings.helios.usernameMaxLength,
			passwordMaxLength: localSettings.helios.passwordMaxLength,
			langCode: lang,
			defaultBirthdate: '1970-01-01',
			pageParams: {
				termsOfUseLink: '<a href="' + localeSettings[lang].urls.termsOfUseLinkUrl + '" target="_blank">'
				+ i18n.t('auth:register.terms-of-use-link-title') + '</a>',
				privacyPolicyLink: '<a href="' + localeSettings[lang].urls.privacyPolicyLinkUrl + '" target="_blank">'
				+ i18n.t('auth:register.privacy-policy-link-title') + '</a>'
			}
		})
}

function getFacebookRegistrationPage (request: Hapi.Request, reply: any): Hapi.Response {
	var context: RegisterFBViewContext,
		redirectUrl: string = authView.getRedirectUrl(request),
		i18n = request.server.methods.i18n.getInstance();

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = deepExtend(
		getDefaultRegistrationContext(request, i18n),
		{
			headerText: 'auth:fb-register.register-with-facebook',
			heliosFacebookRegistrationURL: localSettings.helios.host + '/facebook/users',
			title: 'auth:fb-register.register-with-facebook',
			termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
			footerCallout: 'auth:common.signin-callout',
			footerHref: authUtils.getSignInUrl(request),
			footerCalloutLink: 'auth:fb-register.footer-callout-link',
			bodyClasses: 'register-fb-page',
			facebookAppId: localSettings.facebook.appId,
			headerSlogan: 'auth:fb-register.facebook-registration-info',
			pageParams: {
				facebookAppId: localSettings.facebook.appId
			}
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
		getDefaultRegistrationContext(request, i18n),
		{
			headerText: 'auth:join.sign-up-with-email',
			heliosRegistrationURL: localSettings.helios.host + '/users',
			title: 'auth:join.sign-up-with-email',
			termsOfUseLink: '<a href="' + localeSettings[lang].urls.termsOfUseLinkUrl +
				'" target="_blank">' + i18n.t('auth:register.terms-of-use-link-title') + '</a>',
			footerCallout: 'auth:common.signin-callout',
			footerHref: authUtils.getSignInUrl(request),
			footerCalloutLink: 'auth:common.signin-link-text',
			birthdateInputs: (new BirthdateInput(dateUtils.get('endian', lang), lang)).getInputData(),
			bodyClasses: 'register-page'
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
