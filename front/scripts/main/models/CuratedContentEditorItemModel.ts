/// <reference path="../app.ts" />
'use strict';

interface CuratedContentEditorItemInterface {
	title: string;
	label?: string;
	image_id: number;
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
		title: null,
		label: null,
		image_url: null,
		image_id: null
	}
});
