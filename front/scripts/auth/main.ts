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
		birthdateContainer: HTMLElement,
		bodyClassList = document.body.classList;

	if (formElement) {
		birthdateContainer = <HTMLElement> formElement.querySelector('.birthdate-container');
		new Form(formElement).watch();
		new SubmitValidator(formElement).watch();

		if (formElement.id === 'loginForm') {
			new Login(formElement).watch();
		} else if (formElement.id === 'facebookLoginForm') {
			new FacebookConnect(formElement);
		} else if (formElement.id === 'signupForm') {
			new SignupForm(formElement).watch();
		} else if (formElement.id === 'facebookRegistrationForm') {
			new FacebookRegistration(formElement);
		}
	}

	if (
		bodyClassList.contains('join-page') ||
		(bodyClassList.contains('desktop') && bodyClassList.contains('signin-page'))
	) {
		new FacebookLogin(<HTMLAnchorElement> document.querySelector('.signup-provider-facebook'));
	}

	if (birthdateContainer) {
		new BirthdateInput(birthdateContainer, formElement).init();
	}
});
