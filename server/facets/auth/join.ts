/// <reference path='../../../typings/hapi/hapi.d.ts' />
import authUtils = require('../../lib/AuthUtils');
import caching = require('../../lib/Caching');
import localSettings = require('../../../config/localSettings');
import authView = require('./authView');
import deepExtend = require('deep-extend');

interface JoinViewContext extends authView.AuthViewContext {
	loginRoute: string;
	facebookConnectHref: string;
	signupHref: string;
}

function get (request: Hapi.Request, reply: any): Hapi.Response {
	var context: JoinViewContext,
		redirectUrl: string = authView.getRedirectUrl(request);

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = deepExtend(
		authView.getDefaultContext(request),
		{
			title: 'auth:join.title',
			facebookConnectHref: authUtils.getLoginUrlFromRedirect(redirectUrl),
			loginRoute: '/login?redirect=' + encodeURIComponent(redirectUrl),
			hideHeader: true,
			hideFooter: true,
			bodyClasses: 'splash auth-landing-page',
			noScripts: true,
			signupHref: authUtils.getSignupUrlFromRedirect(redirectUrl),
			bodyClasses: 'splash join-page'
		}
	);

	return authView.view('join-page', context, request, reply);
}

export = get;
