import AuthLogger from '../common/auth-logger';
import AuthTracker from '../common/auth-tracker';
import HttpCodes from '../common/http-codes';
import UrlHelper from '../common/url-helper';
import {trackActions} from 'common/utils/track';

export default class PasswordForm {
	/**
	 * @param {Element} form
	 * @returns {void}
	 */
	constructor(form, trackerOptions = {}) {
		this.form = form;

		this.authLogger = AuthLogger.getInstance();
		this.tracker = new AuthTracker(trackerOptions.category, trackerOptions.pageType);
		this.urlHelper = new UrlHelper();

		this.extractFieldsFromQuery();
	}

	/**
	 * @private
	 */
	extractFieldsFromQuery() {
		if (window.location.search) {
			const params = this.urlHelper.urlDecode(window.location.search.substr(1));

			this.extractFieldsFromPathParameters(params);
		}
	}

	/**
	 * @protected
	 *
	 * @param {array} parameters
	 */
	extractFieldsFromPathParameters(parameters) {
	}

	/**
	 * @private
	 *
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	onSubmit(event) {
		event.preventDefault();

		const button = this.form.querySelector('button'),
			data = this.collectDataBeforeSubmit(),
			xhr = new XMLHttpRequest();

		this.clearErrors();
		button.disabled = true;

		if (this.isInputValid()) {
			xhr.onload = () => {
				button.disabled = false;

				if (xhr.status === HttpCodes.OK) {
					this.onSuccess();
				} else {
					this.handleErrors(xhr);
				}
			};

			xhr.onerror = () => {
				button.disabled = false;
				this.onError(xhr);
			};

			xhr.open('post', this.form.action, true);
			xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
			xhr.send(this.urlHelper.urlEncode(data));
		}
	}

	/**
	 * @protected
	 *
	 * @returns {object} data to be send
	 */
	collectDataBeforeSubmit() {
		return {};
	}

	/**
	 * @protected
	 *
	 * @returns {boolean} true if input is validated, false if errors were found
	 */
	isInputValid() {
		return true;
	}

	/**
	 * @private
	 *
	 * @returns {void}
	 */
	onSuccess() {
		this.tracker.track('forgot-password-success', trackActions.submit);
		document.querySelector('.cards-container').classList.add('dissolved');
	}

	/**
	 * @protected
	 *
	 * @param xhr
	 */
	handleErrors(xhr) {
		try {
			const response = JSON.parse(xhr.responseText);

			response.errors.forEach(error => {
				this.tracker.track(error, trackActions.error);
				this.displayError(`errors.${error}`);
			});
		} catch (e) {
			this.onError(xhr);
		}
	}

	/**
	 * @protected
	 *
	 * @param {XMLHttpRequest} xhr
	 *
	 * @returns {void}
	 */
	onError(xhr) {
		this.authLogger.xhrError(xhr);
		this.tracker.track('server-error', trackActions.error);
		this.displayError('errors.server-error');
	}

	/**
	 * @private
	 *
	 * @returns {void}
	 */
	watch() {
		this.tracker.trackCloseWindow();
		this.form.addEventListener('submit', this.onSubmit.bind(this));

		this.onInit();
		this.focusOnFirstInput();
	}

	/**
	 * @protected
	 *
	 * @returns {void}
	 */
	onInit() {
	}

	/**
	 * @private
	 */
	focusOnFirstInput() {
		const input = this.form.elements[0];
		if (input) {
			input.focus();
			input.setSelectionRange(input.value.length, input.value.length);
		}
	}

	/**
	 * @param {string} messageKey
	 *
	 * @returns {void}
	 */
	displayError(messageKey) {
		const errorElement = document.createElement('small');

		errorElement.classList.add('error');
		errorElement.innerHTML = i18n.t(messageKey);
		this.form.elements[0].parentElement.appendChild(errorElement);
	}

	/**
	 * @private
	 *
	 * @returns {void}
	 */
	clearErrors() {
		this.form.querySelectorAll('small.error').forEach(element => {
			element.parentNode.removeChild(element);
		});
	}
}

