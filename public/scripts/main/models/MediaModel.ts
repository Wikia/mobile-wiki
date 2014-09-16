/// <reference path="../app.ts" />
'use strict';

interface media {
	caption: string;
	fileUrl: string;
	height: number;
	title: string;
	type: string;
	url: string;
	user: string;
	width: number;
}

App.MediaModel = Em.Object.extend({
	media: [],

	refresh: function (media: any[]): void {
		this.set('media', media);
	},

	find: function (id: number): media {
		return this.get('media')[id];
	}
});

App.Media = App.MediaModel.create();
