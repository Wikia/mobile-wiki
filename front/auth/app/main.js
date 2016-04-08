import BirthdateInput from './common/birthdate-input';
import FacebookConnect from './facebook/facebook-connect';
import FacebookLogin from './facebook/facebook-login';
import FacebookRegistration from './facebook/facebook-registration';
import Form from './common/form';
import Login from './common/login';
import SignupForm from './signup/signup-form';
import SubmitValidator from './login/submit-validator';
import VisitSourceWrapper from './common/visit-source-wrapper';
import {init as initTracking} from './tracking';

/**
 * @returns {void}
 */
export function init() {
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
				new FacebookRegistration(formElement).watch();
			}
		}

		if (facebookConnectLink) {
			new FacebookLogin(facebookConnectLink);
		}

		if (birthdateContainer) {
			new BirthdateInput(birthdateContainer, formElement).init();
		}

		VisitSourceWrapper.init();

		initTracking();
	});
}
