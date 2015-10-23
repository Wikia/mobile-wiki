/// <reference path="../../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../../typings/rsvp/rsvp.d.ts" />

'use strict';

class Globals {
	cachedData: any;
	promise: RSVP.Promise;

	constructor() {
		this.cachedData = null;

		this.promise = new RSVP.Promise((resolve, reject) : void => {
			$.get( '/globals', (data) : void => {
				this.cachedData = data;
			});

			resolve();
		});
	}

	getLoginUrl() : string {
		return this.cachedData ? this.cachedData.loginUrl : null;
	}

	getSignupUrl() : string {
		return this.cachedData ? this.cachedData.signupUrl : null;
	}
}
