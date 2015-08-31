/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface InfoboxBuilderGetAssetsResponse {
	css: string[];
	templates: string[];
}

App.InfoboxBuilderRoute = Em.Route.extend({
	templateCompilerLoaded: false,
	templateCompilerPath: '/front/vendor/ember',

	renderTemplate(): void {
		this.render('infobox-builder');
	},

	beforeModel: function(): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			//console.log(App.CurrentUser.get('isAuthenticated'));
			//if (App.CurrentUser.get('isAuthenticated')) {
				this.loadAssets().then(
					(data:InfoboxBuilderGetAssetsResponse) => {
						console.log("data", data);
						this.setupStyles(data.css);
						resolve();
					}, (data:string) => {
						reject(data);
					}
				);
			//} else {
			//	reject();
			//}
		});
	},

	model: function(params: any): typeof App.InfoboxBuilderModel {
		var templates = this.get('templates');

		return App.InfoboxBuilderModel.create({title: params.templateName, templates: templates});
	},

	afterModel: function(model: any): void {
		model.setupInitialState();
	},

	/**
	 * loads infobox builder assets from MW
	 * @returns {Em.RSVP.Promise}
	 */
	loadAssets(): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'PortableInfoboxBuilderController',
					method: 'getAssets',
					format: 'json'
				},
				success: (data: InfoboxBuilderGetAssetsResponse): void => {
					if (data && data.css && data.templates) {
						this.set('templates', data.templates);
						this.loadTemplateCompiler().then(() => {
							App.InfoboxTitleItemComponent.reopen({
								layout: Em.Handlebars.compile(this.sanitizeTemplate(data.templates['title']))
							});
							App.InfoboxDataItemComponent.reopen({
								layout: Em.Handlebars.compile(this.sanitizeTemplate(data.templates['data']))
							});
							App.InfoboxImageItemComponent.reopen({
								//layout: Em.Handlebars.compile(this.sanitizeTemplate(data.templates['image']))
							});
							resolve(data);
						});

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

	sanitizeTemplate( text: string ): string {
		var patternOpen = /\{\{#/g,
			replaceOpen = '{{#if ',
			patternClose = /\{\{\/.+\}\}/g,
			replaceClose = '{{/if}}';

		text = text.replace(patternOpen, replaceOpen);
		text = text.replace(patternClose, replaceClose);

		console.log(text);

		return text;
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

		$(html).appendTo('head');
	},

	/**
	 * Load Template Compiler js
	 * @returns {JQueryXHR}
	 */
	loadTemplateCompiler(): JQueryXHR {
		return Em.$.getScript(`${this.templateCompilerPath}/ember-template-compiler.js`);
	},

	actions: {
		error: function (error: any, transition: EmberStates.Transition): boolean {
			this.controllerFor('application').addAlert({
				message: i18n.t('app.infobox-builder-load-error'),
				type: 'alert'
			});
			M.track({
				action: M.trackActions.impression,
				category: 'infoboxBuilder',
				label: 'infobox-builder-load-error'
			});
			return true;
		},
		didTransition: function(): boolean {
			// InfoboxBuilderRoute works in "fullPage mode" (unlike ArticleRoute) which means that it takes
			// over whole page (so navigation, share feature, etc. are not displayed). To understand
			// better take a look at application.hbs.
			this.controllerFor('application').set('fullPage', true);
			window.scrollTo(0, 0);
			return true;
		},

		addDataItem(): void {
			var model = this.modelFor('infoboxBuilder');
			model.addDataItem();
		},

		addTitleItem(): void {
			var model = this.modelFor('infoboxBuilder');
			return model.addTitleItem();
		},

		addImageItem(): void {
			var model = this.modelFor('infoboxBuilder');
			return model.addImageItem();
		},

		saveTemplate(): void {
			var model = this.modelFor('infoboxBuilder');
			return model.saveStateToTemplate();
		},

		cancel(): void {
			//close iframe
		}
	}
});
