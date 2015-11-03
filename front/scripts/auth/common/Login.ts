/**
 * LoginCredentials
 * @typedef {Object} LoginCredentials
 * @property {string} username
 * @property {string} password
 */
interface LoginCredentials {
	username: string;
	password: string;
}

/**
 * LoginResponse
 * @typedef {Object} LoginResponse
 * @property {string} user_id
 * @property {string} access_token
 * @property {string} refresh_token
 * @property {string} token_type
 * @property {string} expires_in
 * @property {string} [error]
 * @property {string} [error_description]
 */
interface LoginResponse {
	user_id: string;
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: string;
	error?: string;
	error_description?: string;
}

/**
 * FormElements
 * @typedef {Object} FormElements
 * @property {HTMLInputElement} username
 * @property {HTMLInputElement} password
 */
interface FormElements extends HTMLCollection {
	username: HTMLInputElement;
	password: HTMLInputElement;
}

/**
 * @class Login
 */
class Login {
	form: HTMLFormElement;
	redirect: string;
	usernameInput: HTMLInputElement;
	passwordInput: HTMLInputElement;
	urlHelper: UrlHelper;
	tracker: AuthTracker;
	authLogger: AuthLogger = AuthLogger.getInstance();

	/**
	 * @constructs Login
	 * @param {Element} form
	 */
	constructor (form: Element) {
		var elements: FormElements;
		this.form = <HTMLFormElement> form;
		elements = <FormElements> this.form.elements;
		this.usernameInput = elements.username;
		this.passwordInput = elements.password;
		this.urlHelper = new UrlHelper();

		if (window.location.search) {
			var params: Object = this.urlHelper.urlDecode(window.location.search.substr(1));
			this.redirect = params['redirect'];
		}
		this.redirect = this.redirect || '/';
		this.tracker = new AuthTracker('user-login-mobile', '/signin');
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {void}
	 */
	public onSubmit (event: Event): void {
		var xhr = new XMLHttpRequest(),
			postData: LoginCredentials = this.getCredentials(),
			submitButton: HTMLElement = <HTMLElement> this.form.querySelector('button'),
			enableSubmitButton = () => {
				submitButton.disabled = false;
				submitButton.classList.remove('on');
			};

		event.preventDefault();
		this.clearError();
		submitButton.disabled = true;
		submitButton.classList.add('on');


		xhr.onload = (): void => {
			var response: LoginResponse;

			enableSubmitButton();

			if (xhr.status === HttpCodes.UNAUTHORIZED) {
				this.tracker.track('login-credentials-error', M.trackActions.error);
				return this.displayError('errors.wrong-credentials');
			} else if (xhr.status !== HttpCodes.OK) {
				this.tracker.track('login-server-error', M.trackActions.error);
				this.authLogger.xhrError(xhr);
				return this.displayError('errors.server-error');
			}

			response = JSON.parse(xhr.responseText);

			if (response.error) {
				// Helios may return an error even if the request returns a 200
				this.tracker.track('login-credentials-error', M.trackActions.error);
				this.displayError('errors.wrong-credentials');
			} else {
				this.onLoginSuccess(response);
			}
		};

		xhr.onerror = (): void => {
			enableSubmitButton();
			this.authLogger.xhrError(xhr);
			this.tracker.track('login-server-error', M.trackActions.error);
			this.displayError('errors.server-error');
		};

		xhr.open('post', this.form.action, true);
		xhr.withCredentials = true;
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send(this.urlHelper.urlEncode(postData));
	}

	/**
	 * @param {LoginResponse} loginResponse
	 *
	 * @returns {void}
	 */
	public onLoginSuccess(loginResponse: LoginResponse): void {
		this.tracker.track('login-success', M.trackActions.submit);
		AuthUtils.authSuccessCallback(this.redirect);
	}

	/**
	 * @returns {void}
	 */
	public watch(): void {
		this.form.addEventListener('submit', this.onSubmit.bind(this));

		// TODO remove when SOC-719 is ready
		if (pageParams.isModal) {
			this.form.querySelector('.forgotten-password').addEventListener('click', function(event) {
				AuthUtils.loadUrl((<HTMLLinkElement> event.target).href);
				event.preventDefault();
			});
		}
	}

	/**
	 * @returns {LoginCredentials}
	 */
	private getCredentials (): LoginCredentials {
		return {
			username: this.usernameInput.value,
			password: this.passwordInput.value
		};
	}

	/**
	 * @param {string} messageKey
	 *
	 * @returns {void}
	 */
	public displayError (messageKey: string): void {
		var errorElement: HTMLElement = document.createElement('small');
		errorElement.classList.add('error');
		errorElement.innerHTML = i18n.t(messageKey);
		this.form.appendChild(errorElement);
	}

	/**
	 * @returns {void}
	 */
	private clearError (): void {
		var errorNode: Node = this.form.querySelector('small.error');
		if (errorNode) {
			errorNode.parentNode.removeChild(errorNode);
		}
	}
}

