/// <reference path="../app.ts" />
'use strict';

interface ArticleMap {
	caption: string;
	fileUrl: string;
	height: number;
	title: string;
	type: string;
	url: string;
	user: string;
	width: number;
}

App.MapModel = Em.Object.extend({
	find: function (id: number): ArticleMap {
		return this.get('map')[id];
	}
});
