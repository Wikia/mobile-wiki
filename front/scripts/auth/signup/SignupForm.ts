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

	constructor(form: Element) {
		this.form = <HTMLFormElement> form;
		if (window.location.search) {
			var params: Object = (new UrlHelper()).urlDecode(window.location.search.substr(1));
			this.redirect = params['redirect'];
		}
		this.redirect = this.redirect || '/';
		this.marketingOptIn = new MarketingOptIn();
		this.marketingOptIn.init();
	}

	private clearValidationErrors(): void {
		var errorNodes: NodeList = this.form.querySelectorAll('.error');

		Array.prototype.forEach.call( errorNodes, (node: HTMLElement): void => {
			if (node.tagName === 'INPUT') {
				node.classList.remove('error');
			} else if (node.classList.contains('input')) {
				node.classList.remove('error');
			} else {
				node.parentNode.removeChild( node );
			}
		});
		this.generalErrorShown = false;
	}

	private displayValidationErrors(errors: Array<HeliosError>): void {
		var errorsDescriptions: string[] = [];

		Array.prototype.forEach.call( errors, (err: HeliosError): void => {
			errorsDescriptions.push(err.description);
			if (this.generalValidationErrors.indexOf(err.description) === -1) {
				this.displayFieldValidationError(err);
			} else {
				this.displayGeneralError();
			}
		});

		this.trackValidationErrors(errorsDescriptions);
	}

	private displayFieldValidationError(err: HeliosError): void {
		var errorNode: HTMLElement = this.createValidationErrorHTMLNode(err.description),
			input: HTMLFormElement = <HTMLFormElement> this.form.elements[err.additional.field],
			specialFieldContainer: HTMLElement;
		input.parentNode.appendChild(errorNode);
		if (specialFieldContainer = <HTMLElement> (<HTMLElement> input.parentNode).querySelector('.input')) {
			// Special case when we imitate input on UI using containers. eg. Birthdate input filed
			specialFieldContainer.classList.add('error');
		} else {
			input.classList.add('error');
		}
	}

	private displayGeneralError(): void {
		if (!this.generalErrorShown) {
			var errorNode: HTMLElement = this.createValidationErrorHTMLNode('registration_error');
			this.form.insertBefore(errorNode, document.getElementById('signupNewsletter').parentNode);
			this.generalErrorShown = true;
		}
	}

	private createValidationErrorHTMLNode(errorDescription: string): HTMLElement {
		var errorNode: HTMLElement = document.createElement('small');
		errorNode.classList.add('error');
		errorNode.appendChild(document.createTextNode(this.translateValidationError(errorDescription)));
		return errorNode;
	}

	private translateValidationError(errCode: string): string {
		return i18n.t('errors.' + errCode);
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

	private trackValidationErrors(errors: Array<string>): void {
		M.track({
			trackingMethod: 'both',
			action: M.trackActions.error,
			category: 'user-login-mobile',
			label: 'registrationValidationErrors: ' + errors.join(';'),
		});
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
		this.clearValidationErrors();

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
						this.displayGeneralError();
					}
				};
				loginXhr.onerror = (e: Event) => {
					enableSubmitButton();
					this.displayGeneralError();
				};

				loginXhr.open('POST', this.form.action.replace('/users', '/token'), true);
				loginXhr.withCredentials = true;
				loginXhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
				loginXhr.send((new UrlHelper()).urlEncode(data));
			} else if (status === HttpCodes.BAD_REQUEST) {
				enableSubmitButton();
				this.displayValidationErrors(JSON.parse(registrationXhr.responseText).errors);
			} else {
				enableSubmitButton();
				this.displayGeneralError();
			}
		};

		registrationXhr.onerror = (e: Event) => {
			enableSubmitButton();
			this.displayGeneralError();
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
