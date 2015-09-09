class AuthUtils {

	public static authSuccessCallback (url?: string): void {
		if (window.parent) {
			window.parent.postMessage({isUserAuthorized: true}, location.protocol + '//' + location.hostname);
			return;
		} else if (url) {
			window.location.href = url;
			return;
		}

		window.location.reload();
	}

	public static loadUrl (url?: string): void {
		var win: Window;

		win = (pageParams.isModal ? window.parent : window);

		if (url) {
			win.location.href = url;
			return
		}

		win.location.reload();
	}
}
