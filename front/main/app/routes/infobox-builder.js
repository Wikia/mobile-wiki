import Ember from 'ember';
import InfoboxBuilderModel from '../models/infobox-builder';

export default Ember.Route.extend({
	pontoLoadingInitialized: false,
	pontoPath: '/front/main/assets/vendor/ponto/ponto.js',

	renderTemplate() {
		this.render('infobox-builder');
	},

	beforeModel() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			if (window.self !== window.top && (!window.Ponto || !this.get('pontoLoadingInitialized'))) {
				Ember.RSVP.Promise.all([
					this.loadAssets(),
					this.loadPonto()
				])
				.then(this.setupStyles)
				.then(this.isWikiaContext)
				.then(resolve, reject);
			} else {
				reject();
			}
		});
	},

	model(params) {
		return InfoboxBuilderModel.create({title: params.templateName});
	},

	afterModel(model) {
		model.setupInitialState();
	},

	/**
	 * @desc checks wikia context using ponto invoke
	 * @returns {Ember.RSVP.Promise}
	 */
	isWikiaContext() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const ponto = window.Ponto;

			ponto.setTarget(ponto.TARGET_IFRAME_PARENT, window.location.origin);

			ponto.invoke(
				'wikia.infoboxBuilder.ponto',
				'isWikiaContext',
				null,
				(data) => {
					if (data && data.isWikiaContext && data.isLoggedIn) {
						resolve();
					} else {
						// TODO: show message that no permissions part of
						// TODO: https://wikia-inc.atlassian.net/browse/DAT-3757
					}
				},
				function (data) {
					this.showPontoError(data);
					reject();
				},
				false
			);
		});
	},

	/**
	 * loads infobox builder assets from MW
	 * @returns {Ember.RSVP.Promise}
	 */
	loadAssets() {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'PortableInfoboxBuilderController',
					method: 'getAssets',
					format: 'json'
				},
				success: (data) => {
					if (data && data.css) {
						resolve(data);
					} else {
						reject('Invalid data was returned from Infobox Builder API');
					}
				},
				error: (data) => reject(data)
			});
		});
	},

	/**
	 * loads ponto and sets ponto target
	 * @returns {JQueryXHR}
	 */
	loadPonto() {
		this.set('pontoLoadingInitialized', true);

		return Ember.$.getScript(this.pontoPath);
	},

	/**
	 * @desc add oasis portable infobox styles to DOM
	 * and add class to main application body to be
	 * able to style whole containter as we want
	 *
	 * @param {Array} promiseResponseArray
	 * @returns {Ember.RSVP.Promise}
	 */
	setupStyles(promiseResponseArray) {
		Ember.$('body').addClass('infobox-builder-body-wrapper');

		return new Ember.RSVP.Promise((resolve) => {
			let html = '';

			promiseResponseArray[0].css.forEach(
				(url) => {
					html += `<link type="text/css" rel="stylesheet" href="${url}">`;
				}
			);

			$(html).appendTo('head');

			resolve(promiseResponseArray);
		});
	},

	/**
	 * @desc shows error message for ponto communication
	 * @param {String} message - error message
	 * @returns {void}
	 */
	showPontoError(message) {
		if (window.console) {
			window.console.error('Ponto Error', message);
		}
	},

	/**
	 * @desc connects with ponto and redirects to template page
	 * @param {String} title - title of the template
	 * @returns {Ember.RSVP.Promise}
	 */
	redirectToTemplatePage(title) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			const ponto = window.Ponto;

			ponto.invoke(
				'wikia.infoboxBuilder.ponto',
				'redirectToTemplatePage',
				title,
				(data) => {
					resolve(data);
				},
				(data) => {
					reject(data);
					this.showPontoError(data);
				},
				false
			);
		});
	},

	actions: {
		error: () => {
			this.controllerFor('application').addAlert({
				message: i18n.t('infobox-builder:main.load-error'),
				type: 'alert'
			});
			M.track({
				action: M.trackActions.impression,
				category: 'infoboxBuilder',
				label: 'load-error'
			});
			return true;
		},

		/**
		 * @returns {Boolean}
		 */
		didTransition() {
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
		 * @returns {void}
		*/
		addItem(type) {
			const model = this.modelFor('infoboxBuilder');

			switch (type) {
			case 'row':
				model.addRowItem();
				break;
			case 'title':
				model.addTitleItem();
				break;
			case 'image':
				model.addImageItem();
				break;
			default:
				break;
			}
		},

		/**
		 * @desc Handles editing title element - calls proper function on model
		 * @param {TitleItem} item
		 * @param {bool} value
		 * @returns {void}
		 */
		editTitleItem(item, value) {
			const model = this.modelFor('infoboxBuilder');

			model.editTitleItem(item, value);
		},

		editRowItem(item, value) {
			const model = this.modelFor('infoboxBuilder');

			model.editRowItem(item, value);
		},

		/**
		 * @desc Handles setting item to edit mode - calls proper function on model
		 * @param {Object} item
		 * @returns {void}
		 */
		setEditItem(item) {
			const model = this.modelFor('infoboxBuilder');

			model.setEditItem(item);
		},

		/**
		 * @desc Handles removing item and calls proper function on model
		 * @param {Object} item
		 * @returns {void}
		 */
		removeItem(item) {
			const model = this.modelFor('infoboxBuilder');

			model.removeItem(item);
		},

		/**
		 * @desc Handles moving item in the state and calls proper function on model
		 * @param {Number} offset
		 * @param {Object} item
		 * @returns {void}
		 */
		moveItem(offset, item) {
			const model = this.modelFor('infoboxBuilder');

			model.moveItem(offset, item);
		},

		/**
		 * @desc Handles the save template button, calls the proper function
		 * on model and connect with <iframe> parent to redirect to another page.
		 * @returns {void}
		 */
		save() {
			const model = this.modelFor('infoboxBuilder');

			model.saveStateToTemplate().then((title) => {
				return this.redirectToTemplatePage(title);
			});
		},

		/**
		 * @desc Handles the cancel button click.
		 * Connect with <iframe> parent to redirect to another page.
		 * @returns {void}
		 */
		cancel() {
			const title = this.modelFor('infoboxBuilder').get('title');

			// maybe some modal "are you sure? You'll lost your work"
			// redirect to template page
			return this.redirectToTemplatePage(title);
		}
	}
});
