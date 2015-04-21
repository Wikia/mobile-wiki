//i18n.init({
//	debug: debug,
//	detectLngQS: 'uselang',
//	fallbackLng: 'en',
//	lng: application.get('language'),
//	lowerCaseLng: true,
//	ns: 'main',
//	resStore: loadedTranslations,
//	useLocalStorage: false
//});

window.document.addEventListener('DOMContentLoaded', function ():void {
	var formElement = window.document.querySelector('form');
	new Form(formElement).watch();
	//new BirthdateInput(window.document.querySelector('.birthdate-container'), 'UK').init();
	new SubmitValidator(formElement).watch();
});
