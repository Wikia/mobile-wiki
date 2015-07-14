interface FacebookUserData {
	email?: string;
}

class FacebookRegistration {

	form: HTMLFormElement;

	constructor (form: HTMLFormElement) {
		new FacebookSDK(this.init.bind(this));
		this.form = form;
	}

	public init (): void {
		window.FB.getLoginStatus(function (facebookResponse: FacebookResponse): void {
			if (status === 'connected') {
				this.getEmailFromFacebook();
			}
		}.bind(this));
	}

	public getEmailFromFacebook(): void {
		window.FB.api('/me', function (response: FacebookUserData) {
			debugger;
		});
	}

	private setUpEmailInput (facebookUserData: FacebookUserData): void {
		var email = facebookUserData.email,
			emailInput = <HTMLInputElement> this.form.namedItem('email');

		if (email && emailInput) {
			emailInput.disabled = true;
			emailInput.value = email;
		}
	}
}
