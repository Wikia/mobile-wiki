/// <reference path="../../../typings/i18next/i18next.d.ts" />
declare var translations: any;
declare var language: string;

i18n.init(<I18nextOptions> {
	fallbackLng: 'en',
	lng: language,
	lowerCaseLng: true,
	ns: 'auth',
	resStore: translations,
	useLocalStorage: false
});

window.document.addEventListener('DOMContentLoaded', function ():void {
	var formElement = window.document.querySelector('form');
	new Form(formElement).watch();
	new SubmitValidator(formElement).watch();
	new Login(formElement).init();
});
