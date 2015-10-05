/// <reference path="../app.ts" />
'use strict';

interface UserModelParams {
	userId: number;
	avatarSize?: number;
}

interface UserProperties {
	avatarPath: string;
	name: string;
	profileUrl: string;
	userId: number;
}

App.UserModel = Em.Object.extend({
	avatarPath: null,
	name: null,
	userId: null,
	rights: null
});

App.UserModel.reopenClass({
	defaultAvatarSize: 100,

	find(params: UserModelParams): Em.RSVP.Promise {
		var avatarSize: number = params.avatarSize || App.UserModel.defaultAvatarSize,
			modelInstance = App.UserModel.create();

		return App.UserModel.loadDetails(params.userId, avatarSize)
			.then((userDetails: any): typeof App.UserModel => {
				var detailsSanitized = App.UserModel.sanitizeDetails(userDetails);
				return modelInstance.setProperties(detailsSanitized);
			});
	},

	loadDetails(userId: number, avatarSize: number): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: M.buildUrl({
					path: '/wikia.php',
				}),
				data: {
					controller: 'UserApi',
					method: 'getDetails',
					ids: userId,
					size: avatarSize
				},
				dataType: 'json',
				success: (result: any): void => {
					if (Em.isArray(result.items)) {
						resolve(result.items[0]);
					} else {
						reject(result);
					}
				},
				error: (err: any): void => {
					reject(err);
				}
			});
		});
	},

	sanitizeDetails(userData: any): UserProperties {
		return {
			name: userData.name,
			userId: userData.user_id,
			avatarPath: userData.avatar,
			profileUrl: M.buildUrl({
				namespace: 'User',
				title: userData.name
			})
		}
	}
});

