/// <reference path="./app.ts" />
/// <reference path="./models/UserModel.ts" />
'use strict';

interface QueryUserInfoResponse {
	query: {
		userinfo: {
			anon?: string;
			id: number;
			name: string;
			rights: string[];
			options: any;
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

	init(): void {
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
				.then(this.loadUserLanguage.bind(this))
				.then(this.loadUserRights.bind(this))
				.catch((err: any): void => {
					this.setUserLanguage();
					Em.Logger.warn('Couldn\'t load current user info', err);
				});
		} else {
			this.setUserLanguage();
		}
		this._super();
	},

	setUserLanguage(userLang: string = null): void {
		var contentLanguage = Em.getWithDefault(Mercury, 'wiki.language.content', 'en'),
			userLanguage = userLang || contentLanguage;

		this.set('language', userLanguage);
		M.prop('userLanguage', userLanguage);
	},

	loadUserLanguage(result: QueryUserInfoResponse): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var userLanguage = Em.get(result, 'query.userinfo.options.language');

			this.setUserLanguage(userLanguage);

			resolve(result);
		});
	},

	loadUserRights(result: QueryUserInfoResponse): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var rightsArray = Em.get(result, 'query.userinfo.rights'),
				rights = {};

			if (!Em.isArray(rightsArray)) {
				reject(result);
			}

			rightsArray.forEach((right: string): void => {
				rights[right] = true;
			});

			this.set('rights', rights);

			resolve(result);
		});
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
				success: (result: QueryUserInfoResponse): void => {
					resolve(result);
				},
				error: (err: any): void => {
					reject(err);
				}
			});
		});
	}
});
