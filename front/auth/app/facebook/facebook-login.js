import AuthLogger from '../common/auth-logger';
import AuthTracker from '../common/auth-tracker';
import AuthUtils from '../common/auth-utils';
import FacebookSDK from './facebook-sdk';
import HttpCodes from '../common/http-codes';
import UrlHelper from '../common/url-helper';
import {trackActions} from 'common/utils/track';

/**
 * @typedef {Object} FacebookResponse
 * @property {FacebookAuthData} authResponse
 * @property {string} status
 */

/**
 * @typedef {Object} FacebookAuthData
 * @property {string} accessToken
 * @property {number} expiresIn
 */

/**
 * @typedef {Object} HeliosFacebookToken
 * @property {string} fb_access_token
 */

/**
 * @class FacebookLogin
 *
 * @property {string} redirect
 * @property {HTMLAnchorElement} loginButton
 * @property {UrlHelper} urlHelper
 * @property {AuthTracker} tracker
 * @property {AuthLogger} authLogger
 */
export default class FacebookLogin {
	/**
	 * @param {HTMLAnchorElement} loginButton
	 * @returns {void}
	 */
	constructor(loginButton) {
		this.authLogger = AuthLogger.getInstance();
		this.tracker = new AuthTracker('user-login-mobile', 'login');
		this.loginButton = loginButton;
		this.urlHelper = new UrlHelper();
		new FacebookSDK(this.init.bind(this));
	}

	/**
	 * @returns {void}
	 */
	init() {
		this.loginButton.addEventListener('click', this.login.bind(this));

		this.redirect = this.urlHelper.urlDecode(window.location.search.substr(1)).redirect || '/';
	}

	/**
	 * @returns {void}
	 */
	login() {
		window.FB.login(this.onLogin.bind(this), {scope: 'email'});
		this.deactivateButton();
	}

	/**
	 * @param {FacebookResponse} response
	 *
	 * @returns {void}
	 */
	onLogin(response) {
		if (response.status === 'connected') {
			this.onSuccessfulLogin(response);
		} else {
			this.onUnsuccessfulLogin(response);
		}
	}

	/**
	 * @returns {void}
	 */
	activateButton() {
		this.loginButton.classList.remove('on');
		this.loginButton.classList.remove('disabled');
	}

	/**
	 * @returns {void}
	 */
	deactivateButton() {
		this.loginButton.classList.add('on');
		this.loginButton.classList.add('disabled');
	}

	/**
	 * @param {FacebookResponse} response
	 *
	 * @returns {void}
	 */
	onSuccessfulLogin(response) {
		this.getHeliosInfoFromFBToken(response.authResponse);
	}

	/**
	 * @returns {void}
	 */
	onUnsuccessfulLogin() {
		this.tracker.track('facebook-login-helios-error', trackActions.error);
		this.activateButton();
	}

	/**
	 * @returns {string}
	 */
	getFacebookRegistrationUrl() {
		let search = window.location.search;

		if (search.indexOf('?') !== -1) {
			search += '&method=facebook';
		} else {
			search += '?method=facebook';
		}

		return `/register${search}`;
	}

	/**
	 * @param {FacebookAuthData} facebookAuthData
	 *
	 * @returns {void}
	 */
	getHeliosInfoFromFBToken(facebookAuthData) {
		const facebookTokenXhr = new XMLHttpRequest(),
			data = {
				fb_access_token: facebookAuthData.accessToken
			},
			url = this.loginButton.getAttribute('data-helios-facebook-uri');

		/**
		 * @param {Event} e
		 * @returns {void}
         */
		facebookTokenXhr.onload = (e) => {
			const status = e.target.status;

			if (status === HttpCodes.OK) {
				this.tracker.track('facebook-link-existing', trackActions.success);
				this.tracker.track('facebook-login-helios-success', trackActions.success);
				AuthUtils.authSuccessCallback(this.redirect, JSON.parse(facebookTokenXhr.responseText).user_id);
			} else if (status === HttpCodes.BAD_REQUEST) {
				this.authLogger.xhrError(facebookTokenXhr);
				window.location.href = this.getFacebookRegistrationUrl();
			} else {
				this.authLogger.xhrError(facebookTokenXhr);
				this.activateButton();
			}
		};

		/**
		 * @returns {void}
		 */
		facebookTokenXhr.onerror = () => {
			this.tracker.track('facebook-login-helios-error', trackActions.error);
			this.authLogger.xhrError(facebookTokenXhr);
			this.activateButton();
		};

		facebookTokenXhr.open('POST', url, true);
		facebookTokenXhr.withCredentials = true;
		facebookTokenXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookTokenXhr.send(this.urlHelper.urlEncode(data));
	}
}
