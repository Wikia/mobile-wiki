interface FacebookResponse {
	authResponse: FacebookAuthData;
	status: string;
}

interface FacebookAuthData {
	accessToken: string;
	expiresIn: number;
}

interface HeliosFacebookToken {
	fb_access_token: string;
}

class FacebookLogin {
	redirect: string;
	loginButton: HTMLAnchorElement;
	urlHelper: UrlHelper;

	constructor (loginButton: HTMLAnchorElement) {
		this.loginButton = loginButton;
		this.urlHelper = new UrlHelper();
		new FacebookSDK(this.init.bind(this));
	}

	public init (): void {
		this.loginButton.addEventListener('click', this.login.bind(this));

		this.redirect = this.urlHelper.urlDecode(window.location.search.substr(1))['redirect'] || '/';
	}

	public login (): void {
		window.FB.login(this.onLogin.bind(this), {scope: 'email'});
		this.deactivateButton();
	}

	public onLogin(response: FacebookResponse): void {
		if (response.status === 'connected') {
			this.onSuccessfulLogin(response);
		} else {
			this.onUnsuccessfulLogin(response);
		}
	}

	private activateButton(): void {
		this.loginButton.classList.remove('on');
		this.loginButton.classList.remove('disabled');
	}

	private deactivateButton(): void {
		this.loginButton.classList.add('on');
		this.loginButton.classList.add('disabled');
	}

	private onSuccessfulLogin(response: FacebookResponse): void {
		this.getHeliosInfoFromFBToken(response.authResponse);
	}

	private onUnsuccessfulLogin(response: FacebookResponse): void {
		this.activateButton();
	}

	private getFacebookRegistrationUrl(): string {
		var href = '/register',
			search = window.location.search;
		if (search.indexOf('?') !== -1) {
			search += '&method=facebook';
		} else {
			search += '?method=facebook';
		}

		return href + search;
	}

	private getHeliosInfoFromFBToken(facebookAuthData: FacebookAuthData): void {
		var facebookTokenXhr = new XMLHttpRequest(),
			data = <HeliosFacebookToken> {
				fb_access_token: facebookAuthData.accessToken
			},
			url = this.loginButton.getAttribute('data-helios-facebook-uri');

		facebookTokenXhr.onload = (e: Event): void => {
			var status: number = (<XMLHttpRequest> e.target).status;

			if (status === HttpCodes.OK) {
				window.location.href = this.redirect;
			} else if (status === HttpCodes.BAD_REQUEST) {
				window.location.href = this.getFacebookRegistrationUrl();
			} else {
				//ToDo: something wrong with Helios backend
				this.activateButton();
			}
		};

		facebookTokenXhr.onerror = (e: Event): void => {
			this.activateButton();
		};

		facebookTokenXhr.open('POST', url, true);
		facebookTokenXhr.withCredentials = true;
		facebookTokenXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookTokenXhr.send(this.urlHelper.urlEncode(data));
	}
}
