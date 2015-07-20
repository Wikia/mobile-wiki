/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorItemModel = Em.Object.extend({
	block: null,
	section: null,
	item: {
		title: null,
		label: null,
		image_url: null,
		image_id: null
	}
});

App.CuratedContentEditorItemModel.reopenClass({
	getEmpty: function (params: any): Em.RSVP.Promise {
		return new Em.RSVP.Promise(function (resolve, reject): void {
			if (params.block) {
				resolve(App.CuratedContentEditorItemModel.create({block: params.block}))
			} else if (params.section) {
				resolve(App.CuratedContentEditorItemModel.create({section: params.section}))
			} else {
				reject('Invalid parent info passed to Edit Item Model.');
			}
		});
	},

	getItem: function (params: any): Em.RSVP.Promise {
		return new Em.RSVP.Promise(function (resolve, reject): void {
			if (params.block) {
				resolve(App.CuratedContentEditorItemModel.create({block: params.block, item: params.item}))
			} else if (params.section) {
				resolve(App.CuratedContentEditorItemModel.create({section: params.section, item: params.item}))
			} else {
				reject('Invalid parent info passed to Edit Item Model.');
			}
		});
	}
});
