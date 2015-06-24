/// <reference path='../../../typings/hapi/hapi.d.ts' />
/// <reference path='./BirthdateInput.ts' />
/// <reference path='../../../config/localSettings.d.ts' />

import BirthdateInput = require('./BirthdateInput');
import dateUtils = require('../../lib/DateUtils');
import localSettings = require('../../../config/localSettings');
import authView = require('./authView');
var deepExtend = require('deep-extend');

interface SignupViewContext extends authView.AuthViewContext {
	headerText?: string;
	i18nContext?: any;
	birthdateInputs: Array<InputData>;
	heliosRegistrationURL?: string;
	termsOfUseLink?: string;
	usernameMaxLength?: number;
	passwordMaxLength?: number;
}

export function get (request: Hapi.Request, reply: any): Hapi.Response {
	var context: SignupViewContext,
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
			heliosRegistrationURL: localSettings.helios.host + '/register',
			title: 'auth:join.sign-up-with-email',
			termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
			footerCallout: 'auth:common.login-callout',
			footerCalloutLink: 'auth:common.login-link-text',
			birthdateInputs: (new BirthdateInput(dateUtils.get('endian', lang), lang)).getInputData(),
			usernameMaxLength: localSettings.helios.usernameMaxLength,
			passwordMaxLength: localSettings.helios.passwordMaxLength,
			bodyClasses: 'signup-page'
		}
	);

	return authView.view('signup', context, request, reply);
}
