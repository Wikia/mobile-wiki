interface SignupViewContext {
	title        : string;
	hideHeader?  : boolean;
	hideFooter?  : boolean;
	exitTo?      : string;
	bodyClasses? : string;
	loadScripts? : boolean;
}

export function get (request: Hapi.Request, reply: any): void {
	var context: SignupViewContext,
		redirectUrl: string = request.query.redirect || '/';

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = {
		exitTo: redirectUrl,
		title: 'Login',
		loadScripts: true
	};

	return reply.view('signup', context, {
		layout: 'wikia-static'
	});
}
