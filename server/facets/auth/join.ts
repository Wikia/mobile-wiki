/// <reference path='../../../typings/hapi/hapi.d.ts' />

interface getContext {
	title        : string;
	loginRoute   : string;
	hideHeader?  : boolean;
	hideFooter?  : boolean;
	exitTo?      : string;
	bodyClasses? : string;
}

function get (request: Hapi.Request, reply: any): void {
	var context: getContext,
		redirectUrl: string = request.query.redirect || '/';

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = {
		title: 'Join Wikia',
		loginRoute: '/login',
		hideHeader: true,
		hideFooter: true,
		exitTo: redirectUrl,
		bodyClasses: 'splash'
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
