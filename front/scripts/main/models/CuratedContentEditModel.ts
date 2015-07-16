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

	/**
	 * @desc Accepts a raw object that comes from CuratedContent API and creates a model that we can use
	 *
	 * @param rawData
	 * @returns {any}
	 */
	sanitize: function (rawData: any): typeof App.CuratedContentEditModel {
		var featured = {},
			regular = {
				items: <any>[]
			},
			optional = {};

		if (rawData.length) {
			rawData.forEach(function (section: CuratedContentEditItemInterface) {
				if (section.featured === 'true') {
					featured = section;
				} else if (section.title === '') {
					optional = section;
				} else {
					regular.items.push(section);
				}
			});
		}

		return App.CuratedContentEditModel.create({
			featured: featured,
			regular: regular,
			optional: optional
		});
	}
});
