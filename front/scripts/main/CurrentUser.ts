/// <reference path="./app.ts" />
/// <reference path="./models/UserModel.ts" />
/// <reference path="../../../typings/jquery.cookie/jquery.cookie.d.ts" />
'use strict';

App.CurrentUser = Em.Object.extend({
	model: null,

	init: function (): void {
		var userId = this.get('userId');
		if (userId !== null) {
			App.UserModel.find({userId: userId}).then((result: any): void => {
				this.set('model', result);
			});
		}
		this._super();
	},

	isAuthenticated: Em.computed.bool('userId'),

	userId: Em.computed(function (): number {
		var cookieUserId = ~~M.prop('userId');
		return cookieUserId > 0 ? cookieUserId : null;
	}),

	authObserver: Em.observer('isAuthenticated', function () {
		M.prop('isAuthenticated', this.get('isAuthenticated'), true);
	}).on('init')
});
