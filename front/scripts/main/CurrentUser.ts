/// <reference path="./app.ts" />
/// <reference path="./models/UserModel.ts" />
'use strict';

interface QueryUserInfoGroupsRightsResponse {
	query: {
		userinfo: {
			anon?: string;
			id: number;
			name: string;
			rights: string[];
		}
	}
}

App.CurrentUser = Em.Object.extend({
	rights: {},
	isAuthenticated: Em.computed.bool('userId'),
	language: null,

	userId: Em.computed(function (): number {
		var cookieUserId = parseInt(M.prop('userId'), 10);
		return cookieUserId > 0 ? cookieUserId : null;
	}),

	init: function (): void {
		var userId = this.get('userId');
		if (userId !== null) {
			App.UserModel.find({userId})
				.then((result: typeof App.UserModel): void => {
					this.setProperties(result);
				})
				.catch((err: any): void => {
					Em.Logger.warn('Couldn\'t load current user model', err);
				});

			this.loadUserInfo()
				.then((rightsArray: string[]): void => {
					var rights = {};

					rightsArray.forEach((right: string): void => {
						rights[right] = true;
					});

					this.set('rights', rights);
				})
				.catch((err: any): void => {
					Em.Logger.warn('Couldn\'t load current user rights', err);
				});
		}
		this._super();
	},

	loadUserInfo(): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: '/api.php',
				data: {
					action: 'query',
					meta: 'userinfo',
					uiprop: 'rights|options',
					format: 'json'
				},
				dataType: 'json',
				success: (result: QueryUserInfoGroupsRightsResponse): void => {
					var rights = Em.get(result, 'query.userinfo.rights');

					this.language = Em.getWithDefault(result, 'query.userinfo.options.language', 'en');
					M.prop('userLanguage', this.language);

					if (Em.isArray(rights)) {
						resolve(rights);
					} else {
						reject(result);
					}
				},
				error: (err: any): void => {
					reject(err);
				}
			});
		});
	}
});
