/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditModel = Em.Object.extend({
	sections: []
});

App.CuratedContentEditModel.reopenClass({
	find: function (): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var modelInstance = App.CuratedContentEditModel.create();

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
					modelInstance.set('sections', data.items);
					resolve(modelInstance);
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	}
});
