var translations,
	language,
	VisitSource;

if (typeof language === 'undefined') {
	language = '';
}

if (typeof translations === 'undefined') {
	translations = {};
}

i18n.init({
	fallbackLng: 'en',
	lng: language,
	lowerCaseLng: true,
	ns: 'auth-front',
	resStore: translations,
	useLocalStorage: false
});

window.document.addEventListener('DOMContentLoaded', function () {
	const formElement = document.querySelector('form'),
		facebookConnectLink = document.querySelector('.signup-provider-facebook');

	let birthdateContainer,
		submitValidator;

	if (formElement) {
		birthdateContainer = formElement.querySelector('.birthdate-container');
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

	if (facebookConnectLink) {
		new FacebookLogin(facebookConnectLink);
	}

	if (birthdateContainer) {
		new BirthdateInput(birthdateContainer, formElement).init();
	}

	VisitSourceWrapper.init();
});
