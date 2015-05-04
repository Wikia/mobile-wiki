/// <reference path="../app.ts" />
'use strict';

App.UserModel = Em.Object.extend({
	avatarPath: null,
	name: null,
	userId: null,

});

App.UserModel.reopenClass({
	defaultAvatarSize: 100,

	find: function (params: {userId: number; avatarSize?: number}) {
		var avatarSize: number = params.avatarSize || App.UserModel.defaultAvatarSize,
			model = App.UserModel.create();

		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax({
				url: App.get('apiBase') + '/User/Details',
				dataType: 'json',
				data: {
					ids: params.userId,
					size: avatarSize
				},
				success: (result: any) => {
					if (result.hasOwnProperty('items') && result.items.constructor === Array) {
						model.setProperties(App.UserModel.getPropertiesFromData(result.items[0]));
					}
					resolve(model);
				},
				error: (result: any) => {
					if (result.status === 404) {
						resolve(model);
					} else {
						reject($.extend(result, model));
					}
				}
			});
		});
	},

	getPropertiesFromData: function (userData: any): Object {
		return {
			name: userData.name,
			userId: userData.user_id,
			avatarPath: userData.avatar
		}
	}
});

