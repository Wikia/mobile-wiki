/// <reference path='../../../typings/hapi/hapi.d.ts' />
import authUtils = require('../../lib/AuthUtils');
import caching = require('../../lib/Caching');
import localSettings = require('../../../config/localSettings');

interface JoinViewContext {
	title: string;
	loginRoute: string;
	facebookConnectHref: string;
	hideHeader?: boolean;
	hideFooter?: boolean;
	exitTo?: string;
	bodyClasses?: string;
	language?: string;
	signupHref: string;
	trackingConfig: any;
}

function get (request: Hapi.Request, reply: any): Hapi.Response {
	var context: JoinViewContext,
		redirectUrl: string = request.query.redirect || '/',
		response: Hapi.Response;

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = {
		title: 'auth:join.title',
		facebookConnectHref: authUtils.getLoginUrlFromRedirect(redirectUrl),
		loginRoute: '/login?redirect=' + encodeURIComponent(redirectUrl),
		hideHeader: true,
		hideFooter: true,
		exitTo: redirectUrl,
		bodyClasses: 'splash join-page',
		signupHref: authUtils.getSignupUrlFromRedirect(redirectUrl),
		language: request.server.methods.i18n.getInstance().lng(),
		trackingConfig: localSettings.tracking
	};

	response = reply.view(
		'auth-landing-page',
		context,
		{
			layout: 'auth'
		}
	);

	caching.disableCache(response);
	return response;
}

export = get;
