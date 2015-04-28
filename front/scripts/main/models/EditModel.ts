/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury" />
'use strict';

App.EditModel = Em.Object.extend({
	content: null,
	timestamp: null,
	title: null,
	sectionIndex: null
});

App.EditModel.reopenClass({

	getEditToken: function(title: string): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax({
				// FIXME: Hardcoded URL
				url: 'http://visualeditor.inez.wikia-dev.com/api.php',
				data: {
					action: 'query',
					prop: 'info',
					titles: title,
					intoken: 'edit',
					format: 'json'
				},
				dataType: 'json',
				success: (resp): void => {
					// FIXME: MediaWiki API, seriously?
					var edittoken = $.map( resp.query.pages, function ( page ) {
						return page.edittoken;
					} )[0];
					resolve(edittoken);
				},
				error: (err): void => {
					reject(err);
				}
			});
		});
	},

	publish: function(model: any): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			this.getEditToken(model.title)
			.then((token: any) => {
				Em.$.ajax({
					// FIXME: Hardcoded URL
					url: 'http://visualeditor.inez.wikia-dev.com/api.php',
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
					success: (resp): void => {
						resolve();
					}
				});
			});
		});
	},

	load: function(title: string, sectionIndex: number): Em.RSVP.Promise {
		var model = App.EditModel.create({
			title: title,
			sectionIndex: sectionIndex
		});

		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			// FIXME: Hardcoded URL
			Em.$.getJSON('http://visualeditor.inez.wikia-dev.com/api.php', {
				action: 'query',
				prop: 'revisions',
				// FIXME: It should be possible to pass props as an array
				rvprop: 'content|timestamp',
				titles: title,
				rvsection: sectionIndex,
				format: 'json'
			})
			.done((resp): void => {
				if (resp.error) {
					reject(resp.error.code);
					return;
				}

				// FIXME: MediaWiki API, seriously?
				var revision = $.map( resp.query.pages, function ( page ) {
					return page.revisions[0];
				} )[0];

				model.set('content', revision['*']);
				model.set('timestamp', revision.timestamp);
				resolve(model);
			})
			.fail((err): void => {
				reject(err);
			});
		});
	}
});