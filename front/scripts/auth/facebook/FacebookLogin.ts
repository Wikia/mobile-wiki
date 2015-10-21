/**
 * FacebookResponse
 * @typedef {object} FacebookResponse
 * @property {FacebookAuthData} authResponse
 * @property {string} status
 */
interface FacebookResponse {
	authResponse: FacebookAuthData;
	status: string;
}

/**
 * FacebookAuthData
 * @typedef {object} FacebookAuthData
 * @property {string} accessToken
 * @property {number} expiresIn
 */
interface FacebookAuthData {
	accessToken: string;
	expiresIn: number;
}

/**
 * HeliosFacebookToken
 * @typedef {object} HeliosFacebookToken
 * @property {string} fb_access_token
 */
interface HeliosFacebookToken {
	fb_access_token: string;
}

/**
 * @class FacebookLogin
 */
class FacebookLogin {
	redirect: string;
	loginButton: HTMLAnchorElement;
	urlHelper: UrlHelper;
	tracker: AuthTracker;
	authLogger: AuthLogger = AuthLogger.getInstance();

	/**
	 * @constructs FacebookLogin
	 * @param {HTMLAnchorElement} loginButton
	 */
	constructor (loginButton: HTMLAnchorElement) {
		this.loginButton = loginButton;
		this.urlHelper = new UrlHelper();
		new FacebookSDK(this.init.bind(this));
		this.tracker = new AuthTracker('user-login-mobile', 'login');
	}

	/**
	 * @returns {undefined}
	 */
	public init (): void {
		this.loginButton.addEventListener('click', this.login.bind(this));

		this.redirect = this.urlHelper.urlDecode(window.location.search.substr(1))['redirect'] || '/';
	}

	/**
	 * @returns {undefined}
	 */
	public login (): void {
		window.FB.login(this.onLogin.bind(this), {scope: 'email'});
		this.deactivateButton();
	}

	/**
	 * @param {FacebookResponse} response
	 *
	 * @returns {undefined}
	 */
	public onLogin(response: FacebookResponse): void {
		if (response.status === 'connected') {
			this.onSuccessfulLogin(response);
		} else {
			this.onUnsuccessfulLogin(response);
		}
	}

	/**
	 * @returns {undefined}
	 */
	private activateButton(): void {
		this.loginButton.classList.remove('on');
		this.loginButton.classList.remove('disabled');
	}

	/**
	 * @returns {undefined}
	 */
	private deactivateButton(): void {
		this.loginButton.classList.add('on');
		this.loginButton.classList.add('disabled');
	}

	/**
	 * @param {FacebookResponse} response
	 *
	 * @returns {undefined}
	 */
	private onSuccessfulLogin(response: FacebookResponse): void {
		this.getHeliosInfoFromFBToken(response.authResponse);
	}

	/**
	 * @param {FacebookResponse} response
	 *
	 * @returns {undefined}
	 */
	private onUnsuccessfulLogin(response: FacebookResponse): void {
		this.tracker.track('facebook-login-helios-error', Mercury.Utils.trackActions.error);
		this.activateButton();
	}

	/**
	 * @returns {string}
	 */
	private getFacebookRegistrationUrl(): string {
		var href = '/register',
			search = window.location.search;
		if (search.indexOf('?') !== -1) {
			search += '&method=facebook';
		} else {
			search += '?method=facebook';
		}

		return href + search;
	}

	/**
	 * @param {FacebookAuthData} facebookAuthData
	 *
	 * @returns {undefined}
	 */
	private getHeliosInfoFromFBToken(facebookAuthData: FacebookAuthData): void {
		var facebookTokenXhr = new XMLHttpRequest(),
			data = <HeliosFacebookToken> {
				fb_access_token: facebookAuthData.accessToken
			},
			url = this.loginButton.getAttribute('data-helios-facebook-uri');

		facebookTokenXhr.onload = (e: Event): void => {
			var status: number = (<XMLHttpRequest> e.target).status;
			if (status === HttpCodes.OK) {
				this.tracker.track('facebook-link-existing', Mercury.Utils.trackActions.success);
				this.tracker.track('facebook-login-helios-success', Mercury.Utils.trackActions.success);
				AuthUtils.authSuccessCallback(this.redirect);
			} else if (status === HttpCodes.BAD_REQUEST) {
				this.authLogger.xhrError(facebookTokenXhr);
				window.location.href = this.getFacebookRegistrationUrl();
			} else {
				this.authLogger.xhrError(facebookTokenXhr);
				this.activateButton();
			}
		};

		facebookTokenXhr.onerror = (e: Event): void => {
			this.tracker.track('facebook-login-helios-error', M.trackActions.error);
			this.authLogger.xhrError(facebookTokenXhr);
			this.activateButton();
		};

		facebookTokenXhr.open('POST', url, true);
		facebookTokenXhr.withCredentials = true;
		facebookTokenXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookTokenXhr.send(this.urlHelper.urlEncode(data));
	}
}
