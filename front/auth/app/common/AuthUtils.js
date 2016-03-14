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
		const win = (pageParams.isModal ? window.opener ? window.opener : window.parent : window);

		if (url) {
			win.location.href = url;
			return;
		}

		win.location.reload();
	}
}
