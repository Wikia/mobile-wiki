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
			}, (): void => {});
		}
		this._super();
	},

	isAuthenticated: Em.computed.bool('userId'),

	userId: function (): number {
		var cookieUserId = ~~$.cookie('uid');
		return cookieUserId > 0 ? cookieUserId : null;
	}.property()
});
