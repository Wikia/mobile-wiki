interface HeliosFacebookConnectData {
	fb_access_token: string;
}

interface PageParams {
	facebookAppId: number;
}

interface Window {
	pageParams: PageParams;
}

class FacebookConnect extends Login {
	urlHelper: UrlHelper;
	submitValidator: SubmitValidator;
	tracker: AuthTracker;
	utils: Utils;

	constructor (form: HTMLFormElement, submitValidator: SubmitValidator) {
		super(form);
		new FacebookSDK(this.init.bind(this));
		this.urlHelper = new UrlHelper();
		this.submitValidator = submitValidator;
		this.tracker = new AuthTracker('signup');
	}

	public init (): void {
		window.FB.getLoginStatus(function (facebookResponse: FacebookResponse): void {
			var status: string = facebookResponse.status;
			if (status === 'connected') {
				this.watch();
			} else {
				this.displayError('errors.server-error');
				//FB SDK failed, we won't be able to connect accounts
				this.submitValidator.disablePermanently();
			}
		}.bind(this));
	}

	private getHeliosFacebookConnectData(): HeliosFacebookConnectData {
		return {
			fb_access_token: window.FB.getAccessToken()
		};
	}

	private getHeliosFacebookConnectUrl(userId: string): string {
		return this.form.getAttribute('data-heliosFacebookConnectURL')
			+ userId + '/facebook_app_id/' + window.pageParams.facebookAppId;
	}

	public onLoginSuccess (loginResponse: LoginResponse): void {
		var facebookConnectXhr = new XMLHttpRequest(),
			data: HeliosFacebookConnectData = this.getHeliosFacebookConnectData(),
			url: string = this.getHeliosFacebookConnectUrl(loginResponse.user_id);

		facebookConnectXhr.onload = (e: Event) => {
			var status: number = (<XMLHttpRequest> e.target).status;

			if (status === HttpCodes.OK) {
				this.tracker.track('facebook-link-existing', M.trackActions.success);
				Utils.loadUrl(this.redirect);
			} else {
				this.tracker.track('facebook-link-existing', M.trackActions.error);
				this.displayError('errors.server-error');
			}
		};

		facebookConnectXhr.onerror = (e: Event) => {
			this.displayError('errors.server-error');
		};

		facebookConnectXhr.open('PUT', url, true);
		facebookConnectXhr.withCredentials = true;
		facebookConnectXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookConnectXhr.send(this.urlHelper.urlEncode(data));
	}
}
