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
	credentials: LoginCredentials;
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
		this.redirect = this.appendCachebuster(redirect);
	}

	public init (): void {
		this.form.addEventListener('submit', (event: Event): void => {
			event.preventDefault();
			this.onSubmit();
		});
	}

	public onSubmit (): void {
		var xhr = new XMLHttpRequest(),
			credentials: LoginCredentials = this.getCredentials(),
			_this = this;

		xhr.onload = function (): void {
			var response: LoginResponse;

			if (this.status !== 200) {
				return _this.displayError(this.status === 401 ? 'login.wrong-credentials' : 'common.server-error');
			}

			response = JSON.parse(this.responseText);

			if (response.error) {
				// Helios may return an error even if the request returns a 200
				_this.displayError('login.wrong-credentials');
			} else {
				window.location.href = _this.redirect;
			}
		};

		xhr.onerror = function (): void {
			_this.displayError('common.server-error');
		};

		xhr.open('post', this.form.action, true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send('username=' + encodeURIComponent(credentials.username) + '&password=' + encodeURIComponent(credentials.password));
	}

	private getCredentials (): LoginCredentials {
		return {
			username: this.usernameInput.value,
			password: this.passwordInput.value
		};
	}

	private appendCachebuster (path: string): string {
		var query: Array<string>;

		if (typeof path !== 'string' || path === '') {
			path = '/';
		}

		query = path.match(/\?.+/);

		if (query === null) {
			path += '?';
		} else if (query[0].match(/cb=/) === null) {
			path += '&';
		} else {
			// Path already contains a cb param in the querystring
			return path;
		}

		path += 'cb=' + Math.floor(Math.random() * 10000);
		return path;
	}

	private displayError (messageKey: string): void {
		var errorElement = <HTMLElement> this.form.querySelector('small.error');
		errorElement.innerHTML = i18n.t(messageKey);
	}
}

