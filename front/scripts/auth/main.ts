/// <reference path="../../../typings/i18next/i18next.d.ts" />
declare var translations: any;
declare var language: string;

if (typeof language === 'undefined') {
	language = '';
}

if (typeof translations === 'undefined') {
	translations = {};
}

i18n.init(<I18nextOptions> {
	fallbackLng: 'en',
	lng: language,
	lowerCaseLng: true,
	ns: 'auth-front',
	resStore: translations,
	useLocalStorage: false
});

window.document.addEventListener('DOMContentLoaded', function ():void {
	var formElement: HTMLFormElement = <HTMLFormElement> document.querySelector('form'),
		facebookConnectLink = <HTMLAnchorElement> document.querySelector('.signup-provider-facebook'),
		birthdateContainer: HTMLElement,
		submitValidator: SubmitValidator;

	if (formElement) {
		birthdateContainer = <HTMLElement> formElement.querySelector('.birthdate-container');
		new Form(formElement).watch();
		submitValidator = new SubmitValidator(formElement);
		submitValidator.watch();

		if (formElement.id === 'loginForm') {
			new Login(formElement).watch();
		} else if (formElement.id === 'facebookConnectForm') {
			new FacebookConnect(formElement, submitValidator);
		} else if (formElement.id === 'signupForm') {
			new SignupForm(formElement).watch();
		} else if (formElement.id === 'facebookRegistrationForm') {
			new FacebookRegistration(formElement);
		}
	}

	//if (document.body.className.indexOf('join-page') !== -1) {
	//	new FacebookLogin(<HTMLAnchorElement> document.querySelector('.signup-provider-facebook'));
	//}

	if (birthdateContainer) {
		new BirthdateInput(birthdateContainer, formElement).init();
	}
});
