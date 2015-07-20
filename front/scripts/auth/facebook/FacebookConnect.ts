interface HeliosFacebookConnectData {
	fb_access_token: string;
}

class FacebookConnect {

	form: HTMLFormElement;
	redirect: string;
	urlHelper: UrlHelper;
	login: Login;

	constructor (form: HTMLFormElement) {
		new FacebookSDK(this.init.bind(this));
		this.login = new Login(form);
		this.form = form;
		this.urlHelper = new UrlHelper();
		if (window.location.search) {
			var params: Object = this.urlHelper.urlDecode(window.location.search.substr(1));
			this.redirect = params['redirect'];
		}
		this.redirect = this.redirect || '/';
	}

	public init (): void {
		window.FB.getLoginStatus(function (facebookResponse: FacebookResponse): void {
			var status = facebookResponse.status;

			if (status === 'connected') {
				this.login.watch(this.onLoginSuccess.bind(this));
			}
		}.bind(this));
	}

	private getHeliosFacebookConnectData(): HeliosFacebookConnectData {
		return {
			fb_access_token: window.FB.getAccessToken()
		};
	}

	private getHeliosFacebookConnectUrl(userId: string): string {
		return this.form.action + userId + '/facebook_app_id/' + M.prop('facebookAppId');
	}

	public onLoginSuccess (loginResponse: LoginResponse): void {
		var facebookConnectXhr = new XMLHttpRequest(),
			data = this.getHeliosFacebookConnectData(),
			url = this.getHeliosFacebookConnectUrl(loginResponse.user_id);

		facebookConnectXhr.onload = (e: Event) => {
			var status: number = (<XMLHttpRequest> e.target).status;

			if (status === HttpCodes.OK) {
				window.location.href = this.redirect;
			} else if (status === HttpCodes.BAD_REQUEST) {
				//ToDo show the "unable to connect" error
			} else {
				//ToDo show the "unable to connect" error
			}
		};

		facebookConnectXhr.onerror = (e: Event) => {
			//ToDo show the "unable to connect" error
		};

		facebookConnectXhr.open('PUT', url, true);
		facebookConnectXhr.withCredentials = true;
		facebookConnectXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookConnectXhr.send(this.urlHelper.urlEncode(data));
	}
}
