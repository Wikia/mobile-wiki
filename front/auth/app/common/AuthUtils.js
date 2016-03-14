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
		const windowOpener = window.opener || window.parent;

		if (windowOpener && pageParams.parentOrigin) {
			windowOpener.postMessage({isUserAuthorized: true}, pageParams.parentOrigin);
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
		let win;

		if (pageParams.isModal) {
			win = window.opener || window.parent;
		} else {
			win = window;
		}

		if (url) {
			win.location.href = url;
			return;
		}

		win.location.reload();
	}
}
