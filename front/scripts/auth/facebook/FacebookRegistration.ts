interface window {
	FB: {
		getLoginStatus: Function;
		getAccessToken: Function;
		api: Function;
	}
}

interface FacebookUserData {
	email?: string;
}

interface HeliosFacebookRegistrationData {
	email: string;
	username: string;
	password: string;
	birthdate: string;
	langCode?: string;
	marketingallowed?: string;
	fb_access_token: string;
}

class FacebookRegistration {

	form: HTMLFormElement;
	redirect: string;
	urlHelper: UrlHelper;

	constructor (form: HTMLFormElement) {
		new FacebookSDK(this.init.bind(this));
		this.form = form;
		this.urlHelper = new UrlHelper();
		if (window.location.search) {
			var params: Object = this.urlHelper.urlDecode(window.location.search.substr(1));
			this.redirect = params['redirect'];
		}
		this.redirect = this.redirect || '/';

		this.form.addEventListener('submit', this.onSubmit.bind(this));
	}

	public init (): void {
		window.FB.getLoginStatus(function (facebookResponse: FacebookResponse): void {
			var status = facebookResponse.status;

			if (status === 'connected') {
				this.getEmailFromFacebook();
			}
		}.bind(this));
	}

	public getEmailFromFacebook(): void {
		window.FB.api('/me', this.setUpEmailInput.bind(this));
	}

	private setUpEmailInput (facebookUserData: FacebookUserData): void {
		var email = facebookUserData.email,
			emailInput = <HTMLInputElement> this.form.elements.namedItem('email'),
			emailInputLabel: HTMLLabelElement;

		if (email && emailInput) {
			emailInput.disabled = true;
			emailInputLabel = <HTMLLabelElement> emailInput.nextElementSibling;
			emailInputLabel.classList.add('active');
			emailInput.value = email;
		}
	}

	private getHeliosRegistrationDataFromForm(): HeliosFacebookRegistrationData {
		var formElements: HTMLCollection = this.form.elements;
		return {
			username: (<HTMLInputElement> formElements.namedItem('username')).value,
			password: (<HTMLInputElement> formElements.namedItem('password')).value,
			email: (<HTMLInputElement> formElements.namedItem('email')).value,
			birthdate: (<HTMLInputElement> formElements.namedItem('birthdate')).value,
			langCode: (<HTMLInputElement> formElements.namedItem('langCode')).value,
			marketingallowed: (<HTMLInputElement> formElements.namedItem('marketingallowed')).value,
			fb_access_token: window.FB.getAccessToken()
		};
	}

	public onSubmit (event: Event): void {
		event.preventDefault();

		var facebookRegistrationXhr = new XMLHttpRequest(),
			data = <HeliosFacebookRegistrationData> this.getHeliosRegistrationDataFromForm(),
			url = this.form.getAttribute('action');

		facebookRegistrationXhr.onload = (e: Event) => {
			var status: number = (<XMLHttpRequest> e.target).status;

			if (status === HttpCodes.OK) {
				window.location.href = this.redirect;
			} else if (status === HttpCodes.BAD_REQUEST) {
				//ToDo: show validation errors
			} else {
				//ToDo: show unhealthy backed message
			}
		};

		facebookRegistrationXhr.onerror = (e: Event) => {
			//ToDo: show unhealthy backed message
		};

		facebookRegistrationXhr.open('POST', url, true);
		facebookRegistrationXhr.withCredentials = true;
		facebookRegistrationXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookRegistrationXhr.send(this.urlHelper.urlEncode(data));
	}
}
