/// <reference path="../app.ts" />
'use strict';

// {"name":"Garth Webb","joined":"May 1 2010","location":"San Francisco"}
App.UserProfileModel = Em.Object.extend({
	name: null,
	joined: null,
	location: null,
	avatarURI: null,
	band: null
});

App.UserProfileModel.reopenClass({
	find () {
		return Em.RSVP.Promise((resolve, reject) => {
			Em.$.ajax({
				url: 'http://garth.garth.wikia-dev.com/wikia.php?controller=FacebookClient&method=userInfo&format=json',
				dataType: 'json',
				success: (data) => {
					resolve(data);
				},
				error: (err) => {
					reject(err);
				}
			});
		});
	}
})
