/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditItemModel = Em.Object.extend({
	block: null,
	section: null,
	item: {
		title: null,
		label: null,
		image_url: null,
		image_id: null
	}
});

App.CuratedContentEditItemModel.reopenClass({
	getEmpty: function (): Em.RSVP.Promise {
		return new Em.RSVP.Promise(function (resolve): void {
			resolve(App.CuratedContentEditItemModel.create());
		});
	}
});
