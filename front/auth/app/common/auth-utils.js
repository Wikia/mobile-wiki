import HttpCodes from './http-codes';
import AuthLogger from './auth-logger';

/**
 * @class AuthUtils
 */
export default class AuthUtils {
	/**
	 * Check whether user has requested Account Close or not.
	 * After that check redirect user to Special:CloseMyAccount/reactivate or source page.
	 *
	 * @param {string} url
	 * @param {string} userId
	 *
	 * @returns {void}
	 */
	static authSuccessCallback(url, userId) {
		const xhr = new XMLHttpRequest(),
			authLogger = AuthLogger.getInstance(),
			redirectUserBack = (url) => {
				// Need to know which window should be reloaded
				const mainWindow = window.opener || window.parent;

				if (mainWindow && pageParams.parentOrigin) {
					mainWindow.postMessage({isUserAuthorized: true}, pageParams.parentOrigin);
					return;
				} else if (url) {
					window.location.href = url;
					return;
				}

				window.location.reload();
			},
			preferencesRequstStartTime = performance.now();

		xhr.onload = () => {
			const preferencesRequstEndTime = performance.now();

			let preferences,
				isAccountCloseRequested;

			authLogger.info({
				message: 'Check if account is scheduled to be closed XHR time',
				value: preferencesRequstEndTime - preferencesRequstStartTime,
			});

			if (xhr.status === HttpCodes.OK) {
				preferences = JSON.parse(xhr.responseText);
				isAccountCloseRequested = preferences.globalPreferences.some((preference) => {
					return preference.name === 'requested-closure-date' && preference.value;
				});

				if (isAccountCloseRequested) {
					return this.loadUrl(pageParams.reactivateAccountUrl);
				}
			} else {
				authLogger.xhrError(xhr);
			}

			return redirectUserBack(url);
		};
		xhr.onerror = () => {
			authLogger.xhrError(xhr);
			redirectUserBack(url);
		};

		xhr.open('get', `${pageParams.preferenceServiceUrl}${userId}`, true);
		xhr.withCredentials = true;
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send();
	}

	/**
	 * @param {string} [url]
	 *
	 * @returns {void}
	 */
	static loadUrl(url) {
		let mainWindow;

		if (pageParams.isModal) {
			mainWindow = window.opener || window.parent;
		} else {
			mainWindow = window;
		}

		if (url) {
			mainWindow.location.href = url;

			// TODO remove when SOC-719 is ready
			if (mainWindow !== window) {
				window.close();
			}
			return;
		}

		mainWindow.location.reload();
	}
}
