/// <reference path="../app.ts" />
'use strict';

interface ArticleMedia {
	caption: string;
	fileUrl: string;
	height: number;
	link: string;
	title: string;
	type: string;
	url: string;
	user: string;
	width: number;
}

App.MediaModel = Em.Object.extend({
	find: function (id: number): ArticleMedia {
		return this.get('media')[id];
	}
});
