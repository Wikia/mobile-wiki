interface FacebookResponse {
	status: string;
	authResponse: FacebookAuthResponse;
}

interface FacebookAuthResponse {
	accessToken: string;
	expiresIn: number;
}

interface HeliosFacebookToken {
	fb_access_token: string;
}

class FacebookLogin {
	redirect: string;
	loginButton: HTMLAnchorElement;

	public init (loginButton: HTMLAnchorElement) {
		this.loginButton = loginButton;
		this.loginButton.addEventListener('click', function (): void {
			window.FB.login(this.onLogin.bind(this));
		}.bind(this));

		this.redirect = (new UrlHelper()).urlDecode(window.location.search.substr(1))['redirect'] || '/';
	}

	private onLogin(response: FacebookResponse): void {
		if (response.status === 'connected') {
			this.onSuccessfulLogin(response);
		} else if (response.status === 'not_authorized') {
			this.onNotAuthorized(response);
		} else {
			this.onUnsuccessfulLogin(response);
		}
	}

	private onSuccessfulLogin(response: FacebookResponse): void {
		this.getHeliosInfoFromFBToken(response.authResponse);
	}

	private onNotAuthorized(response: FacebookResponse): void {
	}

	private onUnsuccessfulLogin(response: FacebookResponse): void {
	}

	private getHeliosInfoFromFBToken(facebookAuthResponse: FacebookAuthResponse): void {
		var facebookTokenXhr = new XMLHttpRequest(),
			data = <HeliosFacebookToken> {
				fb_access_token: facebookAuthResponse.accessToken
			},
			url = this.loginButton.getAttribute('data-helios-facebook-uri');

		facebookTokenXhr.onload = (e: Event) => {
			var status: number = (<XMLHttpRequest> e.target).status;

			if (status === HttpCodes.OK) {
				window.location.href = this.redirect;
			} else if (status === HttpCodes.BAD_REQUEST) {
				//ToDo: assume there's no user associated with the account and go to facebook registration
			} else {
				//ToDo: something wrong with Helios backend
			}
		};

		facebookTokenXhr.onerror = (e: Event) => {
			//ToDo: something wrong with Helios backend
		};

		facebookTokenXhr.open('POST', url, true);
		facebookTokenXhr.withCredentials = true;
		facebookTokenXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookTokenXhr.send((new UrlHelper()).urlEncode(data));
	}
}
