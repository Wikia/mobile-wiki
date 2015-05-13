/// <reference path='../../../typings/hapi/hapi.d.ts' />
import authUtils = require('../../lib/AuthUtils');

interface JoinViewContext {
	title: string;
	loginRoute: string;
	facebookConnectHref: string;
	hideHeader?: boolean;
	hideFooter?: boolean;
	exitTo?: string;
	bodyClasses?: string;
	noScripts?: boolean;
	signupHref: string;
}

function get (request: Hapi.Request, reply: any): void {
	var context: JoinViewContext,
		redirectUrl: string = request.query.redirect || '/';

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
		bodyClasses: 'splash',
		noScripts: true,
		signupHref: authUtils.getSignupUrlFromRedirect(redirectUrl)
	};

	return reply.view(
		'auth-landing-page',
		context,
		{
			layout: 'auth'
		}
	);
}

export = get;
