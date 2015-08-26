/// <reference path="../app.ts" />
'use strict';

interface InfoboxBuilderGetAssetsResponse {
	css: string[];
	templates: string[];
}

App.InfoboxBuilderModel = Em.Object.extend({
	state: [],
	title: null,
});

App.InfoboxBuilderModel.reopenClass({
	load(title: string): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'PortableInfoboxBuilderController',
					method: 'getAssets',
					format: 'json',
					title: title

				},
				success: (data: InfoboxBuilderGetAssetsResponse): void => {
					if (data) {
						resolve(App.InfoboxBuilderModel.init(data));
					} else {
						reject('Invalid data was returned from Infobox Builder API');
					}
				},
				error: (data: any): void => {
					reject(data);
				}
			});
		});
	},

	/**
	 * initualize Infobox Builder UI
	 * @param {InfoboxBuilderGetAssetsResponse} data
	 */
	init(data: InfoboxBuilderGetAssetsResponse): void {
		console.log('works');
		console.log(data);

		App.InfoboxBuilderModel.setupStyles(data.css);
		App.InfoboxBuilderModel.compileTemplates(data.templates);

	},

	/**
	 * add oasis portable infobox styles to DOM
	 * @param {String[]} cssUrls
	 */
	setupStyles(cssUrls: string[]): void {
		var html = '';

		cssUrls.forEach(
			(url: string): void => {
				html += `<link type="text/css" rel="stylesheet" href="${url}">`
			}
		);

		$(html).append('head');
	},

	/**
	 * compitle portable infobox item templates
	 * @param {String[]} templates
	 */
	compileTemplates(templates: string[]): void {

	}
});
