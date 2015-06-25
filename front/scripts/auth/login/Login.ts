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
		this.redirect = redirect;
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

			if (xhr.status !== 200) {
				return this.displayError(xhr.status === 401 ? 'errors.wrong-credentials' : 'common.server-error');
			}

			response = JSON.parse(xhr.responseText);

			if (response.error) {
				// Helios may return an error even if the request returns a 200
				this.displayError('errors.wrong-credentials');

				// An error occurred while logging in
				M.track({
					trackingMethod: 'ga',
					action: Mercury.Utils.trackActions.error,
					category: 'user-login-mobile',
					label: 'login-error'
				});
			} else {
				M.track({
					trackingMethod: 'ga',
					action: Mercury.Utils.trackActions.submit,
					category: 'user-login-mobile',
					label: 'login-success'
				});

				window.location.href = this.redirect;
			}
		};

		xhr.onerror = (): void => {
			M.track({
				trackingMethod: 'ga',
				action: Mercury.Utils.trackActions.error,
				category: 'user-login-mobile',
				label: 'login-server-error'
			});

			enableSubmitButton();

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
}

