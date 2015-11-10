class Globals {
	constructor() {
		this.loadGlobalData().then((data) => {
			this.cachedData = data;
		});
	}

	loadGlobalData() {
		return new RSVP.Promise((resolve, reject)  => {
			$.get('/globals', (data) => {
				resolve(data);
			});
		});
	}

	getLoginUrl()  {
		return this.cachedData ? this.cachedData.loginUrl : null;
	}

	getSignupUrl() {
		return this.cachedData ? this.cachedData.signupUrl : null;
	}
}

module.exports = Globals;
