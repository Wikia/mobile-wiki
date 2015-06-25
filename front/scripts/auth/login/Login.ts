interface LoginCredentials {
	username: string;
	password: string;
}

interface LoginResponse {
	user_id: string;
	access_token: string;
	refresh_token: string;
	token_type: string;
	expires_in: string;
	error?: string;
	error_description?: string;
}

interface FormElements extends HTMLCollection {
	username: HTMLInputElement;
	password: HTMLInputElement;
}

class Login {
	form: HTMLFormElement;
	redirect: string;
	usernameInput: HTMLInputElement;
	passwordInput: HTMLInputElement;

	constructor (form: Element, redirect: string = '') {
		var elements: FormElements;
		this.form = <HTMLFormElement> form;
		elements = <FormElements> this.form.elements;
		this.usernameInput = elements.username;
		this.passwordInput = elements.password;
		this.redirect = redirect || '/';
	}

	public onSubmit (event: Event): void {
		var xhr = new XMLHttpRequest(),
			postData: LoginCredentials = this.getCredentials(),
			submitButton: HTMLElement = <HTMLElement> this.form.querySelector('button'),
			enableSubmitButton = () => {
				submitButton.disabled = false;
				submitButton.classList.remove('on');
			};

		event.preventDefault();
		this.clearError();
		submitButton.disabled = true;
		submitButton.classList.add('on');


		xhr.onload = (): void => {
			var response: LoginResponse;

			enableSubmitButton();

			if (xhr.status === 401) {
				this.track('login-credentials-error', Mercury.Utils.trackActions.error);
				return this.displayError('errors.wrong-credentials');
			} else if (xhr.status !== 200) {
				this.track('login-server-error', Mercury.Utils.trackActions.error);
				return this.displayError('common.server-error');
			}

			response = JSON.parse(xhr.responseText);

			if (response.error) {
				// Helios may return an error even if the request returns a 200
				this.track('login-credentials-error', Mercury.Utils.trackActions.error);
				this.displayError('errors.wrong-credentials');
			} else {
				this.track('login-success', Mercury.Utils.trackActions.submit);
				window.location.href = this.redirect;
			}
		};

		xhr.onerror = (): void => {
			enableSubmitButton();

			this.track('login-server-error', Mercury.Utils.trackActions.error);
			this.displayError('common.server-error');
		};

		xhr.open('post', this.form.action, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send((new UrlHelper()).urlEncode(postData));
	}

	public watch(): void {
		this.form.addEventListener('submit', this.onSubmit.bind(this));
	}

	private getCredentials (): LoginCredentials {
		return {
			username: this.usernameInput.value,
			password: this.passwordInput.value
		};
	}

	private displayError (messageKey: string): void {
		var errorElement: HTMLElement = document.createElement('small');
		errorElement.classList.add('error');
		errorElement.innerHTML = i18n.t(messageKey);
		this.form.appendChild(errorElement);
	}

	private clearError (): void {
		var errorNode: Node = this.form.querySelector('small.error');
		if (errorNode) {
			errorNode.parentNode.removeChild(errorNode);
		}
	}

	private track (label: string, action: string): void {
		M.track({
			trackingMethod: 'ga',
			action: action,
			category: 'user-login-mobile',
			label: label
		});
	}
}

