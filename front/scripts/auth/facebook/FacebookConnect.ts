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

	constructor (form: HTMLFormElement, submitValidator: SubmitValidator) {
		super(form);
		new FacebookSDK(this.init.bind(this));
		this.urlHelper = new UrlHelper();
		this.submitValidator = submitValidator;
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
				M.track({
					trackingMethod: 'both',
					action: Mercury.Utils.trackActions.success,
					category: 'user-signup-mobile',
					label: 'facebook-link-existing'
				});

				window.location.href = this.redirect;
			} else {
				M.track({
					trackingMethod: 'both',
					action: Mercury.Utils.trackActions.error,
					category: 'user-signup-mobile',
					label: 'facebook-link-existing'
				});
				this.displayError('errors.server-error');
			}
		};

		facebookConnectXhr.onerror = (e: Event) => {
			this.displayError('errors.server-error');
		};

		facebookConnectXhr.open('POST', url, true);
		facebookConnectXhr.withCredentials = true;
		facebookConnectXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookConnectXhr.send(this.urlHelper.urlEncode(data));
	}
}
