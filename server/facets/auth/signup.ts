interface SignupViewContext {
	title        : string;
	currYear      : number;
	header?      : string;
	footer?      : string;
	exitTo?      : string;
	bodyClasses? : string;
	loadScripts? : boolean;
	i18nContext? : any;
}

export function get (request: Hapi.Request, reply: any): void {
	var context: SignupViewContext,
		redirectUrl: string = request.query.redirect || '/';

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = {
		exitTo: redirectUrl,
		header: 'auth:signup.header',
		footer: 'auth:signup.footer',
		title: 'auth:signup.page-title',
		loadScripts: true,
		currYear: new Date().getFullYear(),
		i18nContext: {
			termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
			redirectRoute: encodeURIComponent(redirectUrl)
		}
	};

	return reply.view('signup', context, {
		layout: 'wikia-static'
	});
}
