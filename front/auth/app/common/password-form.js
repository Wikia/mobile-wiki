import AuthTracker from '../common/auth-tracker';
import AuthLogger from '../common/auth-logger';
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

		if (this.inputIsValid()) {
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
	inputIsValid() {
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

	handleErrors(xhr) {
		const response = JSON.parse(xhr.responseText),
			errorsHandled = this.handleCustomErrors(xhr, response);

		if (!errorsHandled) {
			if (response.step === 'service-discovery') {
				this.onError(xhr);
			} else if (response.step === 'user-discovery') {
				this.handleUserDiscoveryErrors(xhr);
			} else {
				this.onError(xhr);
			}
		}
	}

	/**
	 * @protected
	 *
	 * @param {XMLHttpRequest} xhr
	 * @param {object} response - parsed json response
	 *
	 * @returns {boolean} - true if errors were handled, false otherwise
	 */
	handleCustomErrors(xhr, response) {
		return false;
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
	 * @param {XMLHttpRequest} xhr
	 *
	 * @returns {void}
	 */
	handleUserDiscoveryErrors(xhr) {
		if (xhr.status === HttpCodes.NOT_FOUND) {
			this.onUsernameNotRecognizedError();
		} else {
			this.onError(xhr);
		}
	}

	/**
	 * @protected
	 *
	 * @returns {void}
	 */
	onUsernameNotRecognizedError() {
		this.tracker.track('username-not-recognized', trackActions.error);
		this.displayError('errors.username-not-recognized');
	}

	/**
	 * @private
	 *
	 * @returns {void}
	 */
	watch() {
		this.tracker.trackCloseWindow();
		this.form.addEventListener('submit', this.onSubmit.bind(this));
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

