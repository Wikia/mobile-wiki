interface Window {
	FB?: any;
	fbAsyncInit?: Function;
	facebookAppId: string;
}

class FacebookSDK {

	version: string = 'v2.2';
	/**
	 * Modified code for async download of Facebook SDK javascript
	 * @param {Function} onLoad
	 */
	constructor (onLoad: Function = Function.prototype) {
		var js: HTMLScriptElement,
			firstJS: HTMLScriptElement = window.document.getElementsByTagName('script')[0];
		if (window.document.getElementById('facebook-jssdk')) {
			return;
		}
		js = window.document.createElement('script');
		js.id = 'facebook-jssdk';
		js.src = "//connect.facebook.net/en_US/sdk.js";
		firstJS.parentNode.insertBefore(js, firstJS);

		window.fbAsyncInit = function(): void {
			window.FB.init({
				appId: window.facebookAppId,
				cookie: true,
				version: this.version
			});

			onLoad();
		}.bind(this);
	}
}
