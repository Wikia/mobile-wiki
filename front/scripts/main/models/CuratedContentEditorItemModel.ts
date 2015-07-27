/// <reference path="../app.ts" />
'use strict';

interface CuratedContentEditorItemInterface {
	label: string;
	image_id: number;
	node_type: string;
	image_url?: string;
	article_id?: number;
	featured?: string;
	type?: string;
	video_info?: any;
	items?: CuratedContentEditorItemInterface[]
}

App.CuratedContentEditorItemModel = Em.Object.extend({
	block: null,
	section: null,
	item: {
		label: null,
		image_url: null,
		image_id: null
	}
});

App.CuratedContentEditorItemModel.reopenClass({
	createNew(params: any): typeof App.CuratedContentEditorItemModel {
		var modelParams = $.extend(true, {
			block: null,
			section: null,
			item: {}
		}, params);
		return App.CuratedContentEditorItemModel.create(modelParams);
	}
});
