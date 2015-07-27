/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorItemModel = Em.Object.extend({
	article_id: null,
	image_id: null,
	image_url: null,
	items: null,
	label: null,
	node_type: null,
	title: null,
	type: null
});

App.CuratedContentEditorItemModel.reopenClass({
	// Object Model instance is only created once and all create() method invocations return already created object.
	// Using extend prevents from sharing ember metadata between instances so each time fresh object instance is created.
	createNew(params: any = {}): typeof App.CuratedContentEditorItemModel {
		var modelParams = $.extend(true, {
			article_id: null,
			image_id: null,
			image_url: null,
			items: null,
			label: null,
			node_type: null,
			title: null,
			type: null
		}, params);

		return App.CuratedContentEditorItemModel.create(modelParams);
	}
});
