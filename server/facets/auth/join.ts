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
	isLoggedIn?: boolean;
}

function get (request: Hapi.Request, reply: any): void {
	var context: JoinViewContext,
		redirectUrl: string = request.query.redirect || '/';

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

	if (request.auth.isAuthenticated) {
		console.log('join is authenticated');
		context.isLoggedIn = true;
		//return reply.redirect(redirect);
	} else {
		console.log('join is not authenticated');
	}

	return reply.view(
		'auth-landing-page',
		context,
		{
			layout: 'auth'
		}
	);
}

export = get;
