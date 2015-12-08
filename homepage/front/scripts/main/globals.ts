/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/rsvp/rsvp.d.ts" />

'use strict';

class Globals {
	cachedData: any;

	constructor() {
		this.loadGlobalData().then((data: any) => {
			this.cachedData = data;
		});
	}

	loadGlobalData() : RSVP.Promise {
		return new RSVP.Promise((resolve, reject) : void => {
			$.get( '/globals', (data) : void => {
				resolve(data);
			});
		});
	}

	getLoginUrl() : string {
		return this.cachedData ? this.cachedData.loginUrl : null;
	}

	getSignupUrl() : string {
		return this.cachedData ? this.cachedData.signupUrl : null;
	}
}
