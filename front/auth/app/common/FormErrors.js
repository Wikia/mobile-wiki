import AuthTracker from '../common/AuthTracker';
import {trackActions} from '../../mercury/utils/track';

/**
 * @class FormErrors
 *
 * @property {HTMLFormElement} form
 * @property {string[]} generalValidationErrors
 * @property {boolean} generalErrorShown
 * @property {string} trackingLabelPrefix
 * @property {AuthTracker} tracker
 */
export default class FormErrors {
	/**
	 * @param {HTMLFormElement} form
	 * @param {string} [trackingLabelPrefix='formValidationErrors']
	 * @param {string} [page='signup']
	 * @returns {void}
	 */
	constructor(form, trackingLabelPrefix = 'formValidationErrors', page = 'signup') {
		this.generalValidationErrors = ['email_blocked', 'username_blocked', 'birthdate_below_min_age'];
		this.generalErrorShown = false;
		this.form = form;
		this.trackingLabelPrefix = trackingLabelPrefix;
		this.tracker = new AuthTracker('user-signup-mobile', page);
	}

	/**
	 * @returns {void}
	 */
	clearValidationErrors() {
		const errorNodes = this.form.querySelectorAll('.error');

		/**
		 * @param {HTMLElement} node
		 * @returns {void}
		 */
		Array.prototype.forEach.call(errorNodes, (node) => {
			if (node.tagName === 'INPUT') {
				node.classList.remove('error');
			} else if (node.classList.contains('input')) {
				node.classList.remove('error');
			} else {
				node.parentNode.removeChild(node);
			}
		});
		this.generalErrorShown = false;
	}

	/**
	 * @param {HeliosError[]} errors
	 *
	 * @returns {void}
	 */
	displayValidationErrors(errors) {
		const errorsDescriptions = [];

		/**
		 * @param {HeliosError} err
		 * @returns {void}
		 */
		Array.prototype.forEach.call(errors, (err) => {
			errorsDescriptions.push(err.description);
			if (this.generalValidationErrors.indexOf(err.description) === -1) {
				this.displayFieldValidationError(err);
			} else {
				this.displayGeneralError();
			}
		});

		this.trackValidationErrors(errorsDescriptions);
	}

	/**
	 * @param {HeliosError} err
	 *
	 * @returns {void}
	 */
	displayFieldValidationError(err) {
		const errorNode = this.createValidationErrorHTMLNode(err.description),
			input = this.form.elements[err.additional.field];

		let specialFieldContainer;

		input.parentNode.appendChild(errorNode);

		specialFieldContainer = input.parentNode.querySelector('.input');

		if (specialFieldContainer) {
			// Special case when we imitate input on UI using containers. eg. Birthdate input filed
			specialFieldContainer.classList.add('error');
		} else {
			input.classList.add('error');
		}
	}

	/**
	 * @returns {void}
	 */
	displayGeneralError() {
		if (!this.generalErrorShown) {
			const errorNode = this.createValidationErrorHTMLNode('registration_error');

			this.form.insertBefore(errorNode, document.getElementById('signupNewsletter').parentNode);
			this.generalErrorShown = true;
		}
	}

	/**
	 * @param {string} errorDescription
	 *
	 * @returns {HTMLElement}
	 */
	createValidationErrorHTMLNode(errorDescription) {
		const errorNode = document.createElement('small');

		errorNode.classList.add('error');
		errorNode.appendChild(document.createTextNode(this.translateValidationError(errorDescription)));
		return errorNode;
	}

	/**
	 * @param {string} errCode
	 *
	 * @returns {string}
	 */
	translateValidationError(errCode) {
		return i18n.t(`errors.${errCode}`);
	}

	/**
	 * @param {strings[]} errors
	 *
	 * @returns {void}
	 */
	trackValidationErrors(errors) {
		this.tracker.track(`${this.trackingLabelPrefix}: ${errors.join(';')}`, trackActions.error);
	}
}
