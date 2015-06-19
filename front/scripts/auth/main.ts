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
	var formElement = window.document.querySelector('form');
	if (formElement) {
		new Form(formElement).watch();
		new SubmitValidator(formElement).watch();
		new Login(formElement).watch();
		new SignupForm(formElement).watch();
	}
});
