/// <reference path='../../../typings/hapi/hapi.d.ts' />
/// <reference path='./BirthdateInput.ts' />
/// <reference path='../../../config/localSettings.d.ts' />

import BirthdateInput = require('./BirthdateInput');
import dateUtils = require('../../lib/DateUtils');
import authUtils = require('../../lib/AuthUtils');
import localSettings = require('../../../config/localSettings');
import authView = require('./authView');
var deepExtend = require('deep-extend');

interface RegisterFBViewContext extends authView.AuthViewContext {
	headerText?: string;
	i18nContext?: any;
	birthdateInputs: Array<InputData>;
	heliosFacebookRegistrationURL?: string;
	termsOfUseLink?: string;
	usernameMaxLength: number;
	passwordMaxLength: number;
	langCode: string;
	fbAccessToken: string;
}

export function get (request: Hapi.Request, reply: any): Hapi.Response {
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
			headerText: 'auth:facebook.register-with-facebook',
			heliosFacebookRegistrationURL: localSettings.helios.host + '/facebook/users',
			title: 'auth:join.register-with-facebook',
			termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
			footerCallout: 'auth:common.signin-callout',
			footerHref: authUtils.getSignInUrl(request),
			footerCalloutLink: 'auth:facebook.footer-callout-text',
			bodyClasses: 'register-fb-page',
			usernameMaxLength: localSettings.helios.usernameMaxLength,
			passwordMaxLength: localSettings.helios.passwordMaxLength,
			langCode: lang,
			fbAccessToken: request.params['fbAccessToken']
		}
	);

	return authView.view('register-fb', context, request, reply);
}
