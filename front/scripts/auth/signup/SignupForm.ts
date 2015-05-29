class SignupForm {
	form: HTMLFormElement;

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

	private onSubmit(event: Event) {
		var xhr = new XMLHttpRequest(),
			data = {
				'username': this.form.elements['username'].value,
				'password': this.form.elements['password'].value,
				'email': this.form.elements['email'].value,
				'birthdate': this.form.elements['birthdate'].value
			};

		xhr.onreadystatechange = function() {
			if(xhr.readyState < 4) {
				// TODO throbbing
				return;
			}

			if(xhr.status !== 200) {
				return;
			}
			// TODO error handling

			// all is well
			if(xhr.readyState === 4) {
				alert('signed in correctly');
			}
		}

		xhr.open('POST', ' https://id-dev.wikia-services.com/register', true);
		xhr.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		xhr.send(this.urlEncode(data));

		event.preventDefault();
	}

	public watch (): void {
		this.form.addEventListener('submit', this.onSubmit.bind(this));
	}
}
