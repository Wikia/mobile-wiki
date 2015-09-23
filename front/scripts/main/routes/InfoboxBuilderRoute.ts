/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface InfoboxBuilderGetAssetsResponse {
	css: string[];
}

App.InfoboxBuilderRoute = Em.Route.extend({
	pontoLoadingInitialized: false,
	pontoPath: '/front/vendor/ponto/web/src/ponto.js',

	renderTemplate(): void {
		this.render('infobox-builder');
	},

	beforeModel: function(): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			if (window.self !== window.top && (!window.Ponto || !this.get('pontoLoadingInitialized'))) {
				Em.RSVP.Promise.all([
						this.loadAssets(),
						this.loadPonto()
					])
					.then(this.setupStyles)
					.then(this.isWikiaContext)
					.then(() => {resolve()}, () => {reject()});
			} else {
				reject();
			}
		});
	},

	model: function(params: any): typeof App.InfoboxBuilderModel {
		return App.InfoboxBuilderModel.create({title: params.templateName});
	},

	afterModel: function(model: any): void {
		model.setupInitialState();
	},

	/**
	 * @desc checks wikia context using ponto invoke
	 * @returns {Em.RSVP.Promise}
	 */
	isWikiaContext(): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var ponto = window.Ponto;

			ponto.setTarget(ponto.TARGET_IFRAME_PARENT, window.location.origin);

			ponto.invoke(
				'wikia.infoboxBuilder.ponto',
				'isWikiaContext',
				null,
				function (data: any): void {
					if (data && data.isWikiaContext && data.isLoggedIn) {
						resolve();
					} else {
						//show message that no permissions
					}
				},
				function (data: any): void {
					this.showPontoError(data);
					reject();
				},
				false
			);
		});
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
	 * loads ponto and sets ponto target
	 * @returns {JQueryXHR}
	 */
	loadPonto(): JQueryXHR {
		this.set('pontoLoadingInitialized', true);

		return Em.$.getScript(this.pontoPath);
	},

	/**
	 * add oasis portable infobox styles to DOM
	 * @param {Array} promiseResponseArray
	 * @returns Em.RSVP.Promise
	 */
	setupStyles(promiseResponseArray: Array<any>): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function): void => {
			var html = '';

			promiseResponseArray[0].css.forEach(
				(url:string):void => {
					html += `<link type="text/css" rel="stylesheet" href="${url}">`
				}
			);

			$(html).appendTo('head');

			resolve(promiseResponseArray);
		});
	},

	/**
	 * @desc shows error message for ponto communication
	 * @param {String} message - error message
	 */
	showPontoError(message: any) {
		if (window.console) {
			window.console.error('Ponto Error', message);
		}
	},

	/**
	 * @desc connects with ponto and redirects to template page
	 * @param {String} title - title of the template
	 */
	redirectToTemplatePage(title: string): Em.RSVP.Promise {
		return new Em.RSVP.Promise((resolve: Function, reject: Function): void => {
			var ponto = window.Ponto;

			ponto.invoke(
				'wikia.infoboxBuilder.ponto',
				'redirectToTemplatePage',
				title,
				function(data: any): void {
					resolve(data);
				},
				function(data: any): void {
					reject(data);
					this.showPontoError(data);
				},
				false
			);
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

		/**
		 * @desc Handles the add data, image or title button and call the proper
		 * function on model.
		 * @param {String} type - of item type
		*/
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

		/**
		 * @desc Handles setting item to edit mode and calls proper function on model
		 * @param {DataItem|ImageItem|TitleItem} item
		 * @param {Number} position
		 */
		setEditItem(item: DataItem|ImageItem|TitleItem, position: number): void {
			var model = this.modelFor('infoboxBuilder');

			model.setEditItem(item, position);
		},

		/**
		 * @desc Handles removing item and calls proper function on model
		 * @param {Number} position
		 */
		removeItem(position: number): void {
			var model = this.modelFor('infoboxBuilder');

			model.removeItem(position);
		},

		/**
		 * @desc Handles the save template button, calls the proper function
		 * on model and connect with <iframe> parent to redirect to another page.
		 */
		saveTemplate(): void {
			var model = this.modelFor('infoboxBuilder');
			model.saveStateToTemplate().then((title: string) => {
				return this.redirectToTemplatePage(title);
			});
		},

		/**
		 * @desc Handles the cancel button click.
		 * Connect with <iframe> parent to redirect to another page.
		 */
		cancel(): Em.RSVP.Promise {
			var title = this.modelFor('infoboxBuilder').get('title');
			//maybe some modal "are you sure? You'll lost your work"
			//redirect to template page
			return this.redirectToTemplatePage(title);
		}
	}
});
