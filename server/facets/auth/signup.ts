interface SignupViewContext {
	title: string;
	headerText?: string;
	exitTo?: string;
	bodyClasses?: string;
	loadScripts?: boolean;
	i18nContext?: any;
	footerLinkRoute?: string;
	footerCalloutText?: string;
	footerCalloutLink?: string;
}

interface InputData {
	name: string;
	maxLength: number;
	maxVal: number;
	placeholder: string;
}

function getBirthdateInputs():Array<InputData> {
	return [
		{
			name: 'day',
			maxLength: 2,
			maxVal: 31,
			placeholder: 'DD', // todo i18n
			divider: '/' // todo i18n
		},
		{
			name: 'month',
			maxLength: 2,
			maxVal: 12,
			placeholder: 'MM', // todo i18n
			divider: '/' // todo i18n
		},
		{
			name: 'year',
			maxLength: 4,
			maxVal: new Date().getFullYear(),
			placeholder: 'YYYY', // todo i18n
			divider: '/' // todo i18n
		}
	];
}

export function get (request: Hapi.Request, reply: any): void {
	var context: SignupViewContext,
		redirectUrl: string = request.query.redirect || '/';

	if (request.auth.isAuthenticated) {
		return reply.redirect(redirectUrl);
	}

	context = {
		exitTo: redirectUrl,
		headerText: 'auth:signup.sign-up-with-email',
		footer: 'auth:signup.footer',
		title: 'auth:common.sign-up-with-email',
		loadScripts: true,
		termsOfUseLink: 'http://www.wikia.com/Terms_of_Use',
		footerLinkRoute: '/login?redirect=' + encodeURIComponent(redirectUrl),
		footerCalloutText: 'auth:common.login-callout-text',
		footerCalloutLink: 'auth:common.login-callout-link',
		birthdateInputs: getBirthdateInputs()
	};

	return reply.view('signup', context, {
		layout: 'auth'
	});
}
