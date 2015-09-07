interface HeliosError {
	additional: HeliosErrorAdditional;
	description: string;
}

interface HeliosErrorAdditional {
	field: string;
}

interface HeliosRegisterInput {
	birthdate: string;
	email: string;
	langCode: string;
	password: string;
	username: string;
	marketingallowed?: string;
}

class SignupForm {
	form: HTMLFormElement;
	redirect: string;
	marketingOptIn: MarketingOptIn;
	formErrors: FormErrors;
	pageName: string;
	termsOfUse: TermsOfUse;
	tracker: AuthTracker;

	constructor(form: Element) {
		this.pageName = 'signup';

		this.form = <HTMLFormElement> form;
		if (window.location.search) {
			var params: Object = (new UrlHelper()).urlDecode(window.location.search.substr(1));
			this.redirect = params['redirect'];
		}
		this.redirect = this.redirect || '/';
		this.marketingOptIn = new MarketingOptIn();
		this.termsOfUse = new TermsOfUse(this.form);
		this.marketingOptIn.init();
		this.formErrors = new FormErrors(this.form, 'registrationValidationErrors', this.pageName);
		this.termsOfUse.init();
		this.tracker = new AuthTracker('user-signup-mobile', this.pageName);
	}

	private getFormValues(): HeliosRegisterInput {
		var formElements: HTMLCollection = this.form.elements;
		return {
			username: (<HTMLInputElement> formElements.namedItem('username')).value,
			password: (<HTMLInputElement> formElements.namedItem('password')).value,
			email: (<HTMLInputElement> formElements.namedItem('email')).value,
			birthdate: (<HTMLInputElement> formElements.namedItem('birthdate')).value,
			langCode: (<HTMLInputElement> formElements.namedItem('langCode')).value,
			marketingallowed: (<HTMLInputElement> formElements.namedItem('marketingallowed')).value
		};
	}
	private getWikiaDomain(): string {
		var hostParts: string[] = location.host.split('.').reverse();
		if (hostParts.length >= 2) {
			return hostParts[1] + '.' + hostParts[0];
		}
		return location.host;
	}

	private onSuccessfulRegistration() {
		this.tracker.track('successful-registration', M.trackActions.success);

		Cookie.set(
			'registerSuccess',
			'1',
			{
				domain: this.getWikiaDomain()
			}
		);

		AuthUtils.authSuccessCallback(this.redirect);
	}

	public onSubmit(event: Event): void {
		var registrationXhr = new XMLHttpRequest(),
			data: HeliosRegisterInput = this.getFormValues(),
			submitButton: HTMLElement = <HTMLElement> this.form.querySelector('button'),
			enableSubmitButton = () => {
				submitButton.disabled = false;
				submitButton.classList.remove('on');
			};

		submitButton.disabled = true;
		submitButton.classList.add('on');
		this.formErrors.clearValidationErrors();

		registrationXhr.onload = (e: Event) => {
			var status: number = (<XMLHttpRequest> e.target).status;

			if (status === HttpCodes.OK) {
				this.onSuccessfulRegistration();
			} else if (status === HttpCodes.BAD_REQUEST) {
				enableSubmitButton();
				this.formErrors.displayValidationErrors(JSON.parse(registrationXhr.responseText).errors);
			} else {
				enableSubmitButton();
				this.formErrors.displayGeneralError();
			}
		};

		registrationXhr.onerror = (e: Event) => {
			enableSubmitButton();
			this.formErrors.displayGeneralError();
		};

		registrationXhr.open('POST', this.form.action, true);
		registrationXhr.withCredentials = true;
		registrationXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		registrationXhr.send((new UrlHelper()).urlEncode(data));

		event.preventDefault();
	}

	public watch(): void {
		this.form.addEventListener('submit', this.onSubmit.bind(this));
	}
}
