/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditModel = Em.Object.extend({
	featured: null,
	regular: null,
	optional: null
});

App.CuratedContentEditModel.reopenClass({
	find: function (): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'CuratedContent',
					method: 'getData',
					format: 'json'
				},
				success: (data: any): void => {
					if (Em.isArray(data.data)) {
						resolve(App.CuratedContentEditModel.sanitize(data.data));
					} else {
						reject('Invalid data was returned from Curated Content API');
					}
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	},

	sanitize: function (rawData: any): typeof App.CuratedContentEditModel {
		var featured = {},
			regular = {
				items: []
			},
			optional = {};

		if (rawData.length) {
			if (rawData[0].featured) {
				featured = rawData.shift();
			}

			if (rawData.length) {
				regular = {
					items: rawData
				};

				if (regular.items.slice(-1)[0].title === '') {
					optional = regular.items.pop();
				}
			}
		}

		return App.CuratedContentEditModel.create({
			featured: featured,
			regular: regular,
			optional: optional
		});
	}
});
