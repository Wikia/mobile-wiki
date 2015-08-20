/// <reference path="./app.ts" />
/// <reference path="./models/UserModel.ts" />
'use strict';

interface QueryUserInfoGroupsRightsResponse {
	query: {
		userinfo: {
			id: number;
			name: string;
			anon?: string;
			rights: string[];
			groups: string[];
		}
	}
}

Em.computed.promise = function (fn) {
	return Em.computed(function () {
		var PromisableObjectProxy = Ember.ObjectProxy.extend(Em.PromiseProxyMixin);
		return PromisableObjectProxy.create({
			promise: new Ember.RSVP.Promise(fn)
		});
	});
};

App.CurrentUser = Em.Object.extend({
	model: null,
	rights: Em.computed.promise(function (resolve) {
		Em.$.ajax(<JQueryAjaxSettings>{
			url: '/api.php',
			data: {
				action: 'query',
				meta: 'userinfo',
				uiprop: 'rights',
				format: 'json'
			},
			dataType: 'json',
			success: (result: QueryUserInfoGroupsRightsResponse): void => {
				resolve(result.query.userinfo.rights);
			}
		});
	}),

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
	})
});
