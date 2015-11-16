import BirthdateInput from './common/BirthdateInput';
import FacebookConnect from './facebook/FacebookConnect';
import FacebookLogin from './facebook/FacebookLogin';
import FacebookRegistration from './facebook/FacebookRegistration';
import Form from './common/Form';
import Login from './common/Login';
import SignupForm from './signup/SignupForm';
import SubmitValidator from './login/SubmitValidator';
import VisitSourceWrapper from './common/VisitSourceWrapper';

if (typeof window.language === 'undefined') {
	window.language = '';
}

if (typeof window.translations === 'undefined') {
	window.translations = {};
}

i18n.init({
	fallbackLng: 'en',
	lng: window.language,
	lowerCaseLng: true,
	ns: 'auth-front',
	resStore: window.translations,
	useLocalStorage: false
});

/**
 * @returns {void}
 */
window.document.addEventListener('DOMContentLoaded', () => {
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
