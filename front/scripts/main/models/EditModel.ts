/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury" />
'use strict';

App.EditModel = Em.Object.extend({
	content: null,
	originalContent: null,
	timestamp: null,
	title: null,
	sectionIndex: null,
	isDirty: Em.computed('content', 'originalContent', function (): boolean {
		return this.get('content') !== this.get('originalContent');
	})
});

App.EditModel.reopenClass({

	getEditToken: function(title: string): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax({
				url: Mercury.wiki.basePath + '/api.php',
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
	},

	publish: function(model: any): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			this.getEditToken(model.title)
				.then((token: any): void => {
					Em.$.ajax({
						url: Mercury.wiki.basePath + '/api.php',
						data: {
							action: 'edit',
							title: model.title,
							section: model.sectionIndex,
							text: model.content,
							token: token,
							format: 'json'
						},
						dataType: 'json',
						method: 'POST',
						success: (resp: any): void => {
							if (resp && resp.edit && resp.edit.result === 'Success') {
								resolve();
							} else if (resp && resp.error) {
								reject(resp.error.code);
							} else {
								reject();
							}
						},
						error: (err): void => {
							reject(err);
						}
					});
				}, (err: any) => {
					reject(err);
				});
		});
	},

	load: function(title: string, sectionIndex: number): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax(Mercury.wiki.basePath + '/api.php', {
				dataType: 'json',
				cache: false,
				data: {
					action: 'query',
					prop: 'revisions',
					// FIXME: It should be possible to pass props as an array
					rvprop: 'content|timestamp',
					titles: title,
					rvsection: sectionIndex,
					format: 'json'
				}
			})
			.done((resp): void => {
				var pages: any,
					revision: any;
				if (resp.error) {
					reject(resp.error.code);
					return;
				}
				pages = Em.get(resp, 'query.pages');
				if (pages) {
					// FIXME: MediaWiki API, seriously?
					revision = pages[Object.keys(pages)[0]].revisions[0];
					resolve(App.EditModel.create({
						title: title,
						sectionIndex: sectionIndex,
						content: revision['*'],
						originalContent: revision['*'],
						timestamp: revision.timestamp
					}));
				} else {
					reject();
				}
			})
			.fail((err): void => {
				reject(err);
			});
		});
	}
});
