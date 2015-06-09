interface HeliosError {
	description: string;
	additional: HeliosErrorAdditional;
}

interface HeliosErrorAdditional {
	field: string;
}

interface HeliosRegisterInput {
	username: string;
	password: string;
	email: string;
	birthdate: string;
}

class SignupForm {
	form: HTMLFormElement;
	generalValidationErrors: Array<string> = ['email_blocked', 'username_unavailable', 'birthdate_below_min_age'];
	generalErrorShown: boolean = false;

	constructor(form: Element) {
		this.form = <HTMLFormElement> form;
	}

	private urlEncode(object: Object): string {
		var encodedString: string = '';
		for (var prop in object) {
			if (object.hasOwnProperty(prop)) {
				if (encodedString.length > 0) {
					encodedString += '&';
				}
				encodedString += encodeURI(prop + '=' + object[prop]);
			}
		}
		return encodedString;
	}

	private clearValidationErrors(): void {
		var errorNodes: NodeList = this.form.querySelectorAll('.error');

		Array.prototype.forEach.call( errorNodes, function( node: HTMLElement ) {
			if (node.tagName == 'INPUT') {
				node.classList.remove('error');
			} else {
				node.parentNode.removeChild( node );
			}
		});
		this.generalErrorShown = false;
	}

	private displayValidationErrors(errors: Array<HeliosError>): void {
		Array.prototype.forEach.call( errors, (function( err: HeliosError ) {
			if (this.generalValidationErrors.indexOf(err.description) === -1) {
				this.displayFieldValidationError(err);
			} else {
				this.displayGeneralError();
			}
		}).bind(this));
	}

	private displayFieldValidationError(err: HeliosError): void {
		var errorNode: HTMLElement = this.createValidationErrorHTMLNode(err.description),
			input: HTMLFormElement = <HTMLFormElement> this.form.elements[err.additional.field];
		input.parentNode.appendChild(errorNode);
		input.classList.add('error');
	}

	private displayGeneralError(): void {
		if (!this.generalErrorShown) {
			var errorNode: HTMLElement = this.createValidationErrorHTMLNode('registration_error');
			this.form.insertBefore(errorNode, this.form.querySelector('#signupNewsletter').parentNode);
			this.generalErrorShown = true;
		}
	}

	private createValidationErrorHTMLNode(errorDescription: string): HTMLElement {
		var errorNode: HTMLElement = window.document.createElement('small');
		errorNode.classList.add('error');
		errorNode.appendChild(window.document.createTextNode(this.translateValidationError(errorDescription)));
		return errorNode;
	}

	private translateValidationError(errCode: string): string {
		return i18n.t('errors.' + errCode);
	}

	private onSubmit(event: Event): void {
		var xhr = new XMLHttpRequest(),
			formElements: HTMLCollection = this.form.elements,
			data: HeliosRegisterInput = {
				username: (<HTMLInputElement> formElements.namedItem('username')).value,
				password: (<HTMLInputElement> formElements.namedItem('password')).value,
				email: (<HTMLInputElement> formElements.namedItem('email')).value,
				birthdate: (<HTMLInputElement> formElements.namedItem('birthdate')).value
				// TODO add langCode
			},
			submitButton: HTMLElement = <HTMLElement> this.form.querySelector('button');

		submitButton.setAttribute('disabled', 'disabled');
		submitButton.classList.add('on');
		this.clearValidationErrors();

		xhr.onreadystatechange = (function() {
			if(xhr.readyState < 4) {
				return;
			}

			submitButton.removeAttribute('disabled');
			submitButton.classList.remove('on');

			if (xhr.status === 400) {
				this.displayValidationErrors(JSON.parse(xhr.responseText).errors);
				return;
			}

			if (xhr.status !== 200) {
				this.displayGeneralError();
				return;
			}

			// all is well
			if(xhr.readyState === 4) {
				alert('signed in correctly');
			}
		}).bind(this);

		xhr.open('POST', this.form.action, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send(this.urlEncode(data));

		event.preventDefault();
	}

	public watch (): void {
		this.form.addEventListener('submit', this.onSubmit.bind(this));
	}
}
