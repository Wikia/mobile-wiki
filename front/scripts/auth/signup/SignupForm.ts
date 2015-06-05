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
	formValidationErrors: Array<string> = ['email_blocked'];

	constructor(form: Element) {
		this.form = <HTMLFormElement> form;
	}

	private urlEncode(object: Object) {
		var encodedString = '';
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

	private clearValidationErrors() {
		var errorNodes = this.form.querySelectorAll('.error');

		Array.prototype.forEach.call( errorNodes, function( node: HTMLElement ) {
			if (node.tagName == 'INPUT') {
				node.classList.remove('error');
			} else {
				node.parentNode.removeChild( node );
			}
		});
	}

	private displayValidationErrors(errors: Array<HeliosError>) {
		Array.prototype.forEach.call( errors, (function( err: HeliosError ) {
			if (this.formValidationErrors.indexOf(err.description) === -1) {
				this.displayFieldValidationError(err);
			} else {
				this.displayFormValidationError();
			}
		}).bind(this));
	}

	private displayFieldValidationError(err: HeliosError) {
		var errorNode : HTMLElement = this.createValidationErrorHTMLNode(err.description),
			input : HTMLFormElement = <HTMLFormElement> this.form.elements[err.additional.field];
		input.parentNode.appendChild(errorNode);
		input.classList.add('error');
	}

	private displayFormValidationError() {
		var errorNode : HTMLElement = this.createValidationErrorHTMLNode('registration_error');
		this.form.appendChild(errorNode);
	}

	private createValidationErrorHTMLNode(errorDescription: string) {
		var errorNode : HTMLElement = window.document.createElement('small');
		errorNode.classList.add('error');
		errorNode.appendChild(window.document.createTextNode(this.translateValidationError(errorDescription)));
		return errorNode;
	}

	private translateValidationError(errCode: string) {
		return i18n.t(errCode);
	}

	private onSubmit(event: Event) {
		var xhr = new XMLHttpRequest(),
			formElements: HTMLCollection = this.form.elements,
			data: HeliosRegisterInput = {
				username: (<HTMLInputElement> formElements.namedItem('username')).value,
				password: (<HTMLInputElement> formElements.namedItem('password')).value,
				email: (<HTMLInputElement> formElements.namedItem('email')).value,
				birthdate: (<HTMLInputElement> formElements.namedItem('birthdate')).value
				// TODO add langCode
			};

		this.clearValidationErrors();

		xhr.onreadystatechange = (function() {
			if(xhr.readyState < 4) {
				// TODO throbbing
				return;
			}

			if (xhr.status === 400) {
				this.displayValidationErrors(JSON.parse(xhr.responseText).errors);
				return;
			}

			if (xhr.status !== 200) {
				this.displayFormValidationError();
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
