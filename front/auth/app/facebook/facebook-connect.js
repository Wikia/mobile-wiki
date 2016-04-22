import AuthTracker from '../common/auth-tracker';
import AuthUtils from '../common/auth-utils';
import FacebookSDK from './facebook-sdk';
import HttpCodes from '../common/http-codes';
import Login from '../common/login';
import UrlHelper from '../common/url-helper';
import {trackActions} from 'common/utils/track';

/**
 * @typedef {Object} HeliosFacebookConnectData
 * @property {string} fb_access_token
 */

/**
 * @typedef {Object} PageParams
 * @property {number} facebookAppId
 */

/**
 * @typedef {Object} Window
 * @property {pageParams} pageParams
 */

/**
 * @class FacebookConnect
 *
 * @property {UrlHelper} urlHelper
 * @property {SubmitValidator} submitValidator
 * @property {AuthTracker} tracker
 */
export default class FacebookConnect extends Login {
	/**
	 * @param {HTMLFormElement} form
	 * @param {SubmitValidator} submitValidator
	 *
	 * @returns {void}
	 */
	constructor(form, submitValidator) {
		super(form);
		this.tracker = new AuthTracker('user-login-mobile', 'signup');

		new FacebookSDK(this.init.bind(this));

		this.urlHelper = new UrlHelper();
		this.submitValidator = submitValidator;
	}

	/**
	 * @returns {void}
	 */
	init() {
		/**
		 * @param {FacebookResponse} facebookResponse
		 * @returns {void}
		 */
		window.FB.getLoginStatus((facebookResponse) => {
			if (facebookResponse.status === 'connected') {
				this.watch();
			} else {
				this.displayError('errors.server-error');
				// FB SDK failed, we won't be able to connect accounts
				this.submitValidator.disablePermanently();
			}
		});
	}

	/**
	 * @returns {HeliosFacebookConnectData}
	 */
	getHeliosFacebookConnectData() {
		return {
			fb_access_token: window.FB.getAccessToken()
		};
	}

	/**
	 * @param {string} userId
	 *
	 * @returns {string}
	 */
	getHeliosFacebookConnectUrl(userId) {
		return `${this.form.getAttribute('data-heliosFacebookConnectURL')}${userId}` +
			`/facebook_app_id/${window.pageParams.facebookAppId}`;
	}

	/**
	 * @param {LoginResponse} loginResponse
	 *
	 * @returns {void}
	 */
	onLoginSuccess(loginResponse) {
		const facebookConnectXhr = new XMLHttpRequest(),
			data = this.getHeliosFacebookConnectData(),
			url = this.getHeliosFacebookConnectUrl(loginResponse.user_id);

		/**
		 * @param {Event} e
		 * @returns {void}
         */
		facebookConnectXhr.onload = (e) => {
			const status = e.target.status;

			if (status === HttpCodes.OK) {
				this.tracker.track('facebook-link-existing', trackActions.success);
				AuthUtils.authSuccessCallback(this.redirect, JSON.parse(facebookConnectXhr.responseText).user_id);
			} else {
				const errors = JSON.parse(facebookConnectXhr.responseText).errors,
					logoutXhr = new XMLHttpRequest(),
					errorCodesArray = [];

				/**
				 * @param {HeliosError} error
				 * @returns {void}
				 */
				errors.forEach((error) => {
					this.displayError(`errors.${error.description}`);
					errorCodesArray.push(error.description);
				});

				this.tracker.track(
					`facebook-link-error:${errorCodesArray.join(';')}`,
					trackActions.error
				);

				this.authLogger.xhrError(facebookConnectXhr);

				// Logout user on connection error
				logoutXhr.open('GET', '/logout', true);
				logoutXhr.send();
			}
		};

		/**
		 * @returns {void}
         */
		facebookConnectXhr.onerror = () => {
			this.displayError('errors.server-error');
			this.authLogger.xhrError(facebookConnectXhr);
		};

		facebookConnectXhr.open('POST', url, true);
		facebookConnectXhr.withCredentials = true;
		facebookConnectXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookConnectXhr.send(this.urlHelper.urlEncode(data));
	}
}
