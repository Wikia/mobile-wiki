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

App.CurrentUser = Em.Object.extend({
	model: null,
	groups: [],
	rights: [],

	init: function (): void {
		var userId = this.get('userId');
		if (userId !== null) {
			App.UserModel.find({userId: userId}).then((result: any): void => {
				this.set('model', result);
			});
		}
		this.getGroupsAndRights();
		this._super();
	},

	isAuthenticated: Em.computed.bool('userId'),

	userId: Em.computed(function (): number {
		var cookieUserId = ~~M.prop('userId');
		return cookieUserId > 0 ? cookieUserId : null;
	}),

	getGroupsAndRights(): void {
		Em.$.ajax(<JQueryAjaxSettings>{
			url: '/api.php',
			data: {
				action: 'query',
				meta: 'userinfo',
				uiprop: 'groups|rights',
				format: 'json'
			},
			dataType: 'json',
			success: (result: QueryUserInfoGroupsRightsResponse): void => {
				this.set('groups', result.query.userinfo.groups);
				this.set('rights', result.query.userinfo.rights);
			}
		});
	},

	hasRight(right: string): boolean {
		return this.get('rights').indexOf(right) > -1;
	}
});
