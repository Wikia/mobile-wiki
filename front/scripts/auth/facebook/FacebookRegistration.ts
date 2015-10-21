/**
 * Window
 * @typedef {object} Window
 * @property {{getLoginStatus: Function, getAccessToken: Function, api: Function}} FB
 */
interface window {
	FB: {
		getLoginStatus: Function;
		getAccessToken: Function;
		api: Function;
	}
}

/**
 * FacebookUserData
 * @typedef {object} FacebookUserData
 * @property {string} [email]
 */
interface FacebookUserData {
	email?: string;
}

/**
 * HeliosFacebookRegisterData
 * @typedef {object} HeliosFacebookRegisterData
 * @property {string} birthdate
 * @property {string} email
 * @property {string} fb_access_token
 * @property {string} password
 * @property {string} username
 * @property {string} [langCode]
 * @property {string} [marketingallowed]
 */
interface HeliosFacebookRegistrationData {
	birthdate: string;
	email: string;
	fb_access_token: string;
	password: string;
	username: string;
	langCode?: string;
	marketingallowed?: string;
}

/**
 * @class FacebookRegistration
 */
class FacebookRegistration {

	form: HTMLFormElement;
	redirect: string;
	urlHelper: UrlHelper;
	marketingOptIn: MarketingOptIn;
	formErrors: FormErrors;
	termsOfUse: TermsOfUse;
	tracker: AuthTracker;
	authLogger: AuthLogger = AuthLogger.getInstance();

	/**
	 * @constructs FacebookRegistration
	 * @param {HTMLFormElement} form
	 */
	constructor (form: HTMLFormElement) {
		new FacebookSDK(this.init.bind(this));
		this.form = form;
		this.urlHelper = new UrlHelper();
		if (window.location.search) {
			var params: Object = this.urlHelper.urlDecode(window.location.search.substr(1));
			this.redirect = params['redirect'];
		}
		this.marketingOptIn = new MarketingOptIn();
		this.marketingOptIn.init();
		this.termsOfUse = new TermsOfUse(this.form);
		this.termsOfUse.init();

		this.redirect = this.redirect || '/';
		this.formErrors = new FormErrors(this.form, 'fbRegistrationValidationErrors');

		this.form.addEventListener('submit', this.onSubmit.bind(this));
		this.tracker = new AuthTracker('user-signup-mobile', 'signup');
	}

	/**
	 * @returns void
	 */
	public init (): void {
		window.FB.getLoginStatus(function (facebookResponse: FacebookResponse): void {
			var status = facebookResponse.status;

			if (status === 'connected') {
				this.getEmailFromFacebook();
			}
		}.bind(this));
	}

	/**
	 * @returns void
	 */
	public getEmailFromFacebook(): void {
		window.FB.api('/me', this.setUpEmailInput.bind(this));
	}

	/**
	 * @params {FacebookUserData} facebookUserData
	 *
	 * @returns void
	 */
	private setUpEmailInput (facebookUserData: FacebookUserData): void {
		var email = facebookUserData.email,
			emailInput = <HTMLInputElement> this.form.elements.namedItem('email'),
			emailInputLabel: HTMLLabelElement;

		if (email && emailInput) {
			emailInput.disabled = true;
			emailInputLabel = <HTMLLabelElement> emailInput.nextElementSibling;
			emailInputLabel.classList.add('active');
			emailInput.value = email;
		}
	}

	/**
	 * @returns {HeliosFacebookRegistrationData}
	 */
	private getHeliosRegistrationDataFromForm(): HeliosFacebookRegistrationData {
		var formElements: HTMLCollection = this.form.elements;
		return {
			username: (<HTMLInputElement> formElements.namedItem('username')).value,
			password: (<HTMLInputElement> formElements.namedItem('password')).value,
			email: (<HTMLInputElement> formElements.namedItem('email')).value,
			birthdate: (<HTMLInputElement> formElements.namedItem('birthdate')).value,
			langCode: (<HTMLInputElement> formElements.namedItem('langCode')).value,
			marketingallowed: (<HTMLInputElement> formElements.namedItem('marketingallowed')).value,
			fb_access_token: window.FB.getAccessToken()
		};
	}

	/**
	 * @param {string} facebookToken
	 * @param {string} heliosTokenUrl
	 *
	 * @returns {undefined}
	 */
	private loginWithFacebookAccessToken (facebookToken: string, heliosTokenUrl: string): void {
			var facebookTokenXhr = new XMLHttpRequest(),
			data = <HeliosFacebookToken> {
				fb_access_token: facebookToken
			};

		facebookTokenXhr.onload = (e: Event): void => {
			var status: number = (<XMLHttpRequest> e.target).status;

			if (status === HttpCodes.OK) {
				this.tracker.track('facebook-signup-join-wikia-success', Mercury.Utils.trackActions.success);
				AuthUtils.authSuccessCallback(this.redirect);
			} else if (status === HttpCodes.BAD_REQUEST) {
				this.formErrors.displayGeneralError();
			} else {
				this.formErrors.displayGeneralError();
			}
		};

		facebookTokenXhr.onerror = (e: Event): void => {
			this.formErrors.displayGeneralError();
			this.authLogger.xhrError(facebookTokenXhr);

			this.tracker.track('facebook-signup-join-wikia-error', Mercury.Utils.trackActions.error);
		};

		facebookTokenXhr.open('POST', heliosTokenUrl, true);
		facebookTokenXhr.withCredentials = true;
		facebookTokenXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookTokenXhr.send(this.urlHelper.urlEncode(data));
	}

	/**
	 * @param {Event} event
	 *
	 * @returns {undefined}
	 */
	public onSubmit (event: Event): void {
		event.preventDefault();

		var facebookRegistrationXhr = new XMLHttpRequest(),
			data = <HeliosFacebookRegistrationData> this.getHeliosRegistrationDataFromForm(),
			url = this.form.getAttribute('action');

		this.formErrors.clearValidationErrors();

		facebookRegistrationXhr.onload = (e: Event) => {
			var status: number = (<XMLHttpRequest> e.target).status;

			if (status === HttpCodes.OK) {
				this.loginWithFacebookAccessToken(window.FB.getAccessToken(), url.replace('/users', '/token'));
			} else if (status === HttpCodes.BAD_REQUEST) {
				this.formErrors.displayValidationErrors(JSON.parse(facebookRegistrationXhr.responseText).errors);
			} else {
				this.formErrors.displayGeneralError();
				this.authLogger.xhrError(facebookRegistrationXhr);
			}
		};

		facebookRegistrationXhr.onerror = (e: Event) => {
			this.formErrors.displayGeneralError();
			this.authLogger.xhrError(facebookRegistrationXhr);

			this.tracker.track('facebook-signup-join-wikia-error', Mercury.Utils.trackActions.error);
		};

		facebookRegistrationXhr.open('POST', url, true);
		facebookRegistrationXhr.withCredentials = true;
		facebookRegistrationXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookRegistrationXhr.send(this.urlHelper.urlEncode(data));
	}
}
