/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.UserProfileRoute = Em.Route.extend({
	model () {
		return App.UserProfileModel.find();
	}
});
