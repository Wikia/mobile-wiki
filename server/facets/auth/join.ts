/// <reference path='../../../typings/hapi/hapi.d.ts' />

interface JoinViewContext {
	pageTitleKey: string;
	loginRoute: string;
	signupRoute: string;
	hideHeader?: boolean;
	hideFooter?: boolean;
	exitTo?: string;
	bodyClasses?: string;
	noScripts?: boolean;
}

function get (request: Hapi.Request, reply: any): void {
	var context: JoinViewContext,
		redirectUrl: string = request.query.redirect || '/';

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = {
		pageTitleKey: 'auth:landing-page.page-title',
		loginRoute: '/login?redirect=' + encodeURIComponent(redirectUrl),
		signupRoute: '/signup?redirect=' + encodeURIComponent(redirectUrl),
		hideHeader: true,
		hideFooter: true,
		exitTo: redirectUrl,
		bodyClasses: 'splash',
		noScripts: true
	};

	return reply.view(
		'auth-landing-page',
		context,
		{
			layout: 'wikia-static'
		}
	);
}

export = get;
