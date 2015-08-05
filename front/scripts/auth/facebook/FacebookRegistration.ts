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
	birthdate: string;
	email: string;
	fb_access_token: string;
	password: string;
	username: string;
	langCode?: string;
	marketingallowed?: string;
}

class FacebookRegistration {

	form: HTMLFormElement;
	redirect: string;
	urlHelper: UrlHelper;
	marketingOptIn: MarketingOptIn;
    formErrors: FormErrors;
	termsOfUse: TermsOfUse;

	constructor (form: HTMLFormElement) {
		new FacebookSDK(this.init.bind(this));
		this.form = form;
		this.urlHelper = new UrlHelper();
		if (window.location.search) {
			var params: Object = this.urlHelper.urlDecode(window.location.search.substr(1));
			this.redirect = params['redirect'];
		}
		this.marketingOptIn = new MarketingOptIn();
		this.marketingOptIn.init();
		this.termsOfUse.init();

		this.redirect = this.redirect || '/';
        this.formErrors = new FormErrors(this.form, 'fbRegistrationValidationErrors');

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

	private loginWithFacebookAccessToken (facebookToken: string, heliosTokenUrl: string): void {
			var facebookTokenXhr = new XMLHttpRequest(),
			data = <HeliosFacebookToken> {
				fb_access_token: facebookToken
			};

		facebookTokenXhr.onload = (e: Event): void => {
			var status: number = (<XMLHttpRequest> e.target).status;

			if (status === HttpCodes.OK) {
				this.track('facebook-signup-join-wikia-success', Mercury.Utils.trackActions.success);
				window.location.href = this.redirect;
			} else if (status === HttpCodes.BAD_REQUEST) {
				this.formErrors.displayGeneralError();
			} else {
				this.formErrors.displayGeneralError();
			}
		};

		facebookTokenXhr.onerror = (e: Event): void => {
			this.formErrors.displayGeneralError();
			this.track('facebook-signup-join-wikia-error', Mercury.Utils.trackActions.error);
		};

		facebookTokenXhr.open('POST', heliosTokenUrl, true);
		facebookTokenXhr.withCredentials = true;
		facebookTokenXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookTokenXhr.send(this.urlHelper.urlEncode(data));
	}

	public onSubmit (event: Event): void {
		event.preventDefault();

		var facebookRegistrationXhr = new XMLHttpRequest(),
			data = <HeliosFacebookRegistrationData> this.getHeliosRegistrationDataFromForm(),
			url = this.form.getAttribute('action');

		facebookRegistrationXhr.onload = (e: Event) => {
			var status: number = (<XMLHttpRequest> e.target).status;

			if (status === HttpCodes.OK) {
				this.loginWithFacebookAccessToken(window.FB.getAccessToken(), url.replace('/users', '/token'));
			} else if (status === HttpCodes.BAD_REQUEST) {
				this.formErrors.displayValidationErrors(JSON.parse(facebookRegistrationXhr.responseText).errors);
			} else {
				this.formErrors.displayGeneralError();
			}
		};

		facebookRegistrationXhr.onerror = (e: Event) => {
			this.formErrors.displayGeneralError();
			this.track('facebook-signup-join-wikia-error', Mercury.Utils.trackActions.error);
		};

		facebookRegistrationXhr.open('POST', url, true);
		facebookRegistrationXhr.withCredentials = true;
		facebookRegistrationXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		facebookRegistrationXhr.send(this.urlHelper.urlEncode(data));
	}

	private track (label: string, action: string): void {
		M.track({
			trackingMethod: 'both',
			action: action,
			category: 'user-signup-mobile',
			label: label
		});
	}
}
