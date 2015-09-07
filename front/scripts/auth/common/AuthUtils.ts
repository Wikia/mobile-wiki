class AuthUtils {

	public static authSuccessCallback (url?: string): void {
		if (window.parent) {
			window.parent.postMessage({isUserAuthorized: true}, location.protocol + "//" + location.hostname);
			return;
		}

		else if (url) {
			window.location.href = url;
			return;
		}

		window.location.reload();
	}
}
