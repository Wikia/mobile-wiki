class Utils {

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
