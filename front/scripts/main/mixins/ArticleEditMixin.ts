/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury/utils/buildUrl.ts" />
'use strict';

App.ArticleEditMixin = Em.Mixin.create({

	getEditToken(title: string): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: M.buildUrl({path: '/api.php'}),
				data: {
					action: 'query',
					prop: 'info',
					titles: title,
					intoken: 'edit',
					format: 'json'
				},
				dataType: 'json',
				success: (resp: any): void => {
					var edittoken: string,
						pages: any = Em.get(resp, 'query.pages');
					if (pages) {
						// FIXME: MediaWiki API, seriously?
						edittoken = pages[Object.keys(pages)[0]].edittoken;
						if (edittoken === undefined) {
							reject('noedit');
						}
						resolve(edittoken);
					} else {
						reject();
					}
				},
				error: (err): void => {
					reject(err);
				}
			});
		});
	}

});
