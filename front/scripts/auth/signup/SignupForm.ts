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
	generalValidationErrors: Array<string> = ['email_blocked', 'username_blocked', 'birthdate_below_min_age'];
	generalErrorShown: boolean = false;
	redirect: string;
	marketingOptIn: MarketingOptIn;
    formErrors: FormErrors;

	constructor(form: Element) {
		this.form = <HTMLFormElement> form;
		if (window.location.search) {
			var params: Object = (new UrlHelper()).urlDecode(window.location.search.substr(1));
			this.redirect = params['redirect'];
		}
		this.redirect = this.redirect || '/';
		this.marketingOptIn = new MarketingOptIn();
		this.marketingOptIn.init();
        this.formErrors = new FormErrors(this.form, 'registrationValidationErrors');
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

	private trackSuccessfulRegistration() {
		M.track({
			trackingMethod: 'both',
			action: M.trackActions.success,
			category: 'user-login-mobile',
			label: 'successful-registration'
		});
	}

	private onSubmit(event: Event): void {
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
				// TODO remove this code when SERVICES-377 is fixed
				var loginXhr = new XMLHttpRequest();
				loginXhr.onload = (e: Event) => {
					enableSubmitButton();
					if ((<XMLHttpRequest> e.target).status === HttpCodes.OK) {
						this.trackSuccessfulRegistration();
						window.location.href = this.redirect;
					} else {
                        this.formErrors.displayGeneralError();
					}
				};
				loginXhr.onerror = (e: Event) => {
					enableSubmitButton();
                    this.formErrors.displayGeneralError();
				};

				loginXhr.open('POST', this.form.action.replace('/users', '/token'), true);
				loginXhr.withCredentials = true;
				loginXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				loginXhr.send((new UrlHelper()).urlEncode(data));
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
