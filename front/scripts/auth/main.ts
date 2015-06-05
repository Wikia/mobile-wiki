/// <reference path="../../../typings/i18next/i18next.d.ts" />

var resources = <IResourceStore> {
	en: { translation: {
		'email_already_exists': 'Email is already registered on Wikia',
		'email_invalid': 'Email is not valid',
		'registration_error': 'We can not complete your registration at this time.'
	} },

	// TODO move to translations file
};

i18n.init(<I18nextOptions> {
	detectLngQS: 'uselang',
	fallbackLng: 'en',
	lng: 'en',
	lowerCaseLng: true,
	resStore: resources,
	useLocalStorage: false,
});

window.document.addEventListener('DOMContentLoaded', function ():void {
	var formElement = window.document.querySelector('form');
	new Form(formElement).watch();
	new SubmitValidator(formElement).watch();
	new SignupForm(formElement).watch();
});
