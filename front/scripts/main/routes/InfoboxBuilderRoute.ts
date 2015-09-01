/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../mixins/AmdMixin.ts"/>

'use strict';

interface InfoboxBuilderGetAssetsResponse {
	css: string[];
}

App.InfoboxBuilderRoute = Em.Route.extend(App.AmdMixin, {
	pontoLoadingInitialized: false,
	pontoPath: '/front/vendor/ponto/web/src/ponto.js',

	renderTemplate(): void {
		this.render('infobox-builder');
	},

	beforeModel: function(): void {
		if (window.self !== window.top && (
				!window.Ponto || !this.get('pontoLoadingInitialized')
			)
		) {
			this.suppressDefineAmd(
				this.loadPonto()
			).then(this.checkContext);
		}
	},

	model: function(params: any): typeof App.InfoboxBuilderModel {
		var templates = this.get('templates');

		return App.InfoboxBuilderModel.create({title: params.templateName});
	},

	afterModel: function(model: any): void {
		model.setupInitialState();
	},

	checkContext(): void {
		var ponto = window.Ponto;
		console.log("w checkContext. window.Ponto:", ponto);
		ponto.invoke('wikia.infoboxBuilder.ponto', 'InfoboxBuilderPonto', null, function (data: any) {
			this.setupInfoboxBuilder(data);
		}, this.showPontoError, false);
	},

	setupInfoboxBuilder(data: any): Em.RSVP.Promise|boolean {
		if (data && data.isWikiaContext && data.isLoggedIn) {
			return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
				this.loadAssets().then(
					(data:InfoboxBuilderGetAssetsResponse) => {
						this.setupStyles(data.css);
						resolve();
					}, (data:string) => {
						reject(data);
					}
				);
			});
		} else {
			console.log("We are not in WM context or user has no permissions");
			return false;
		}
	},

	/**
	 * @desc shows error message for ponto communication
	 * @param {string} message - error message
	 */
	showPontoError(message: any) {
		if (window.console) {
			window.console.error('Ponto Error', message);
		}
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
					if (data && data.css) {
						resolve(data);
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

	loadPonto(): JQueryXHR {
		this.set('pontoLoadingInitialized', true);

		return Em.$.getScript(this.pontoPath, (): void => {
			var ponto = window.Ponto;
			console.log("ponto w load ponto", ponto);

			if (ponto && typeof ponto.setTarget === 'function') {
				ponto.setTarget(ponto.TARGET_IFRAME_PARENT, '*');

				console.log("po set target", ponto);
			}
		});
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

		addItem(type: string): void {
			var model = this.modelFor('infoboxBuilder');

			switch (type) {
				case 'data':
					model.addDataItem();
					break;
				case 'title':
					model.addTitleItem();
					break;
				case 'image':
					model.addImageItem();
					break;
			}
		},

		saveTemplate(): void {
			var model = this.modelFor('infoboxBuilder');
			return model.saveStateToTemplate();
		},

		cancel(): void {
			console.log("cancel");
			//close iframe
		}
	}
});
