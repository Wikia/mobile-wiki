/**
 * @class AuthUtils
 */
export default class AuthUtils {
	/**
	 * @param {string} [url]
	 *
	 * @returns {void}
	 */
	static authSuccessCallback(url) {
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
			return;
		}

		mainWindow.location.reload();
	}
}
