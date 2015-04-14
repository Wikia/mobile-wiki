interface SignupViewContext {
	title: string;
	currYear: number;
	headerText?: string;
	exitTo?: string;
	bodyClasses?: string;
	loadScripts?: boolean;
	i18nContext?: any;
	footerLinkRoute?: string;
	footerCalloutText?: string;
	footerCalloutLink?: string;
}

export function get (request: Hapi.Request, reply: any): void {
	var context: SignupViewContext,
		redirectUrl: string = request.query.redirect || '/';

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = {
		exitTo: redirectUrl,
		currYear: new Date().getFullYear(),
		headerText: 'auth:signup.sign-up-with-email',
		footer: 'auth:signup.footer',
		title: 'auth:signup.sign-up-with-email',
		loadScripts: true,
		termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
		footerLinkRoute: '/login?redirect=' + encodeURIComponent(redirectUrl),
		footerCalloutText: 'auth:common.login-callout-text',
		footerCalloutLink: 'auth:common.login-callout-link'
	};

	return reply.view('signup', context, {
		layout: 'wikia-static'
	});
}
