interface window {
	FB?: any;
	fbAsyncInit?: Function;
}

class FacebookSDK {
	constructor (onLoad: Function = Function.prototype) {
		var js: HTMLScriptElement,
			fjs: HTMLScriptElement = window.document.getElementsByTagName('script')[0];
		if (window.document.getElementById('facebook-jssdk')) {
			return;
		}
		js = window.document.createElement('script');
		js.id = 'facebook-jssdk';
		js.src = "//connect.facebook.net/en_US/sdk.js";
		fjs.parentNode.insertBefore(js, fjs);

		window.fbAsyncInit = function(): void {
			window.FB.init({
				appId: M.prop('facebookAppId'),
				cookie: true,
				version: 'v2.2'
			});

			onLoad();
		};
	}
}
