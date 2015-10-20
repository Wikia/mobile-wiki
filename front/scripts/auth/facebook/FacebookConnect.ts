/**
 * HeliosFacebookConnectData
 * @typedef {object} HeliosFacebookConnectData
 * @property {string} fb_access_token
 */
interface HeliosFacebookConnectData {
	fb_access_token: string;
}

/**
 * PageParams
 * @typedef {object} PageParams
 * @property {number} facebookAppId
 */
interface PageParams {
	facebookAppId: number;
}

/**
 * Window
 * @typedef {object} Window
 * @property {pageParams} pageParams
 */
interface Window {
	pageParams: PageParams;
}


/**
 * @class FacebookConnect
 */
class FacebookConnect extends Login {
	urlHelper: UrlHelper;
	submitValidator: SubmitValidator;
	tracker: AuthTracker;

	/**
	 * @param {HTMLFormElement} form
	 * @param {SubmitValidator} submitValidator
	 */
	constructor (form: HTMLFormElement, submitValidator: SubmitValidator) {
		super(form);
		new FacebookSDK(this.init.bind(this));
		this.urlHelper = new UrlHelper();
		this.submitValidator = submitValidator;
		this.tracker = new AuthTracker('user-login-mobile', 'signup');
	}

	/**
	 * @returns {void}
	 */
	public init (): void {
		window.FB.getLoginStatus(function (facebookResponse: FacebookResponse): void {
			var status: string = facebookResponse.status;
			if (status === 'connected') {
				this.watch();
			} else {
				this.displayError('errors.server-error');
				//FB SDK failed, we won't be able to connect accounts
				this.submitValidator.disablePermanently();
			}
		}.bind(this));
	}

	/**
	 * @returns {HeliosFacebookConnectData}
	 */
	private getHeliosFacebookConnectData(): HeliosFacebookConnectData {
		return {
			fb_access_token: window.FB.getAccessToken()
		};
	}

	/**
	 * @param {string} userId
	 *
	 * @returns {string}
	 */
	private getHeliosFacebookConnectUrl(userId: string): string {
		return this.form.getAttribute('data-heliosFacebookConnectURL')
			+ userId + '/facebook_app_id/' + window.pageParams.facebookAppId;
	}

	/**
	 * @param {LoginResponse} loginResponse
	 *
	 * @returns {void}
	 */
	public onLoginSuccess (loginResponse: LoginResponse): void {
		var facebookConnectXhr = new XMLHttpRequest(),
			data: HeliosFacebookConnectData = this.getHeliosFacebookConnectData(),
			url: string = this.getHeliosFacebookConnectUrl(loginResponse.user_id);

		facebookConnectXhr.onload = (e: Event) => {
			var status: number = (<XMLHttpRequest> e.target).status,
				errors: Array<HeliosError>,
				errorCodesArray: Array<string> = [],
				logoutXhr: XMLHttpRequest;

			if (status === HttpCodes.OK) {
				this.tracker.track('facebook-link-existing', M.trackActions.success);
				AuthUtils.authSuccessCallback(this.redirect);
			} else {
				errors = JSON.parse(facebookConnectXhr.responseText).errors;

				errors.forEach(
					(error: HeliosError): void => {
						this.displayError('errors.' + error.description);
						errorCodesArray.push(error.description)
					}
				);

				this.tracker.track(
					'facebook-link-error:' + errorCodesArray.join(';'),
					M.trackActions.error
				);

				this.authLogger.xhrError(facebookConnectXhr);

				// Logout user on connection error
				logoutXhr = new XMLHttpRequest();
				logoutXhr.open('GET', '/logout', true);
				logoutXhr.send();
			}
		};

		facebookConnectXhr.onerror = (e: Event) => {
			this.displayError('errors.server-error');

			this.authLogger.xhrError(facebookConnectXhr);
		};

		facebookConnectXhr.open('POST', url, true);
		facebookConnectXhr.withCredentials = true;
		facebookConnectXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookConnectXhr.send(this.urlHelper.urlEncode(data));
	}
}
