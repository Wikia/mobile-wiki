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
	getEmpty: function (params: any): Em.RSVP.Promise {
		return new Em.RSVP.Promise(function (resolve, reject): void {
			console.log(params);
			if (params.block) {
				resolve(App.CuratedContentEditItemModel.create({block: params.block}))
			} else if (params.section) {
				resolve(App.CuratedContentEditItemModel.create({section: params.section}))
			} else {
				reject('Invalid parent info passed to Edit Item Model.');
			}
		});
	}
});
