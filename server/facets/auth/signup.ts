interface SignupViewContext {
	pageTitleKey : string;
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
		pageTitleKey: 'auth:signup.page-title',
		loadScripts: true,
		i18nContext: {
			termsOfUseLink: 'http://www.wikia.com/Terms_of_Use'
		}
	};

	return reply.view('signup', context, {
		layout: 'wikia-static'
	});
}
