class FormErrors {
	form: HTMLFormElement;
	generalValidationErrors: Array<string> = ['email_blocked', 'username_blocked', 'birthdate_below_min_age'];
	generalErrorShown: boolean = false;
	trackingLabelPrefix: string;
	tracker: AuthTracker;

	constructor (form: HTMLFormElement, trackingLabelPrefix: string = 'formValidationErrors', page: string = 'signup') {
		this.form = form;
		this.trackingLabelPrefix = trackingLabelPrefix;
		this.tracker = new AuthTracker('user-signup-mobile', page);
	}

	public clearValidationErrors(): void {
		var errorNodes: NodeList = this.form.querySelectorAll('.error');

		Array.prototype.forEach.call( errorNodes, (node: HTMLElement): void => {
			if (node.tagName === 'INPUT') {
				node.classList.remove('error');
			} else if (node.classList.contains('input')) {
				node.classList.remove('error');
			} else {
				node.parentNode.removeChild(node);
			}
		});
		this.generalErrorShown = false;
	}

	public displayValidationErrors(errors: Array<HeliosError>): void {
		var errorsDescriptions: string[] = [];
		Array.prototype.forEach.call(errors, (err: HeliosError): void => {
			errorsDescriptions.push(err.description);
			if (this.generalValidationErrors.indexOf(err.description) === -1) {
				this.displayFieldValidationError(err);
			} else {
				this.displayGeneralError();
			}
		});

		this.trackValidationErrors(errorsDescriptions);
	}

	public displayFieldValidationError(err: HeliosError): void {
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

	public displayGeneralError(): void {
		if (!this.generalErrorShown) {
			var errorNode: HTMLElement = this.createValidationErrorHTMLNode('registration_error');
			this.form.insertBefore(errorNode, document.getElementById('signupNewsletter').parentNode);
			this.generalErrorShown = true;
		}
	}

	public createValidationErrorHTMLNode(errorDescription: string): HTMLElement {
		var errorNode: HTMLElement = document.createElement('small');
		errorNode.classList.add('error');
		errorNode.appendChild(document.createTextNode(this.translateValidationError(errorDescription)));
		return errorNode;
	}

	public translateValidationError(errCode: string): string {
		return i18n.t('errors.' + errCode);
	}

	public trackValidationErrors(errors: Array<string>): void {
		this.tracker.track(this.trackingLabelPrefix + ': ' + errors.join(';'), M.trackActions.error);
	}
}
