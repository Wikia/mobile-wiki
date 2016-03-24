import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';
import InfoboxBuilderModel from '../models/infobox-builder';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';

export default Ember.Route.extend(ConfirmationMixin, {
	pontoLoadingInitialized: false,
	pontoPath: '/front/main/assets/vendor/ponto/ponto.js',

	/**
	 * Load infobox data and additional assets with AJAX request and run methods that will handle them
	 *
	 * @param {Transition} transition
	 * @returns {Ember.RSVP.Promise}
	 */
	beforeModel(transition) {
		const templateName = transition.params['infobox-builder'].templateName;

		return new Ember.RSVP.Promise((resolve, reject) => {
			if (window.self !== window.top && (!window.Ponto || !this.get('pontoLoadingInitialized'))) {
				const promises = {
					dataAndAssets: this.loadInfoboxDataAndAssets(templateName),
					ponto: this.loadPonto()
				};

				Ember.RSVP.hash(promises)
					.then((responses) => {
						this.setupStyles(responses.dataAndAssets);
						this.setupInfoboxData(responses.dataAndAssets);
					})
					.then(this.isWikiaContext)
					.then(resolve)
					.catch(reject);
			} else {
				reject('Infobox builder has to be loaded in an iframe');
			}
		});
	},

	/**
	 * @param {Object} params
	 * @returns {Object}
	 */
	model(params) {
		// temporary disable passing title to model
		const test = {};

		return InfoboxBuilderModel.create({title: test.templateName});
	},

	/**
	 * Uses data loaded in beforeModel to set model properties
	 *
	 * @param {Object} model
	 * @returns {void}
	 */
	afterModel(model) {
		const controller = this.controllerFor('infobox-builder');

		model.setupInfoboxData(controller.get('infoboxData'), controller.get('isNew'));
	},

	actions: {
		/**
		 * @param {Object} error
		 * @returns {Boolean}
		 */
		error(error) {
			Ember.Logger.error(error);

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
		 * Connects with ponto and redirects to template page
		 *
		 * @returns {Ember.RSVP.Promise}
		 */
		redirectToTemplatePage() {
			let action = 'redirectToPreviousPage';

			if (this.controllerFor('infobox-builder').get('model.title')) {
				action = 'redirectToTemplatePage';
			}

			return new Ember.RSVP.Promise((resolve, reject) => {
				const ponto = window.Ponto;

				ponto.invoke(
					'wikia.infoboxBuilder.ponto',
					action,
					null,
					(data) => resolve(data),
					(data) => {
						reject(data);
						this.showPontoError(data);
					},
					false
				);
			});
		},

		/**
		 * Connects with ponto and redirects to source editor
		 *
		 * @returns {void}
		 */
		goToSourceEditor() {
			const ponto = window.Ponto;

			ponto.invoke(
				'wikia.infoboxBuilder.ponto',
				'redirectToSourceEditor',
				null,
				Ember.K,
				(data) => {
					this.showPontoError(data);
				},
				false
			);
		}
	},

	/**
	 * Checks wikia context using ponto invoke
	 *
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
						// @todo DAT-3757 show message that user doesn't have proper permission
						// currently this else block isn't called even for anons
					}
				},
				(data) => {
					this.showPontoError(data);
					reject();
				},
				false
			);
		});
	},

	/**
	 * Loads infobox data and builder assets from MW
	 *
	 * @param {string} templateName
	 * @returns {Ember.RSVP.Promise}
	 */
	loadInfoboxDataAndAssets(templateName) {
		return new Ember.RSVP.Promise((resolve, reject) => {
			Ember.$.ajax({
				url: M.buildUrl({
					path: '/wikia.php'
				}),
				data: {
					controller: 'PortableInfoboxBuilderController',
					method: 'getAssets',
					format: 'json',
					title: templateName
				},
				success: (data) => {
					if (data && data.css && data.data) {
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
	 * Loads ponto and sets ponto target
	 *
	 * @returns {JQueryXHR}
	 */
	loadPonto() {
		this.set('pontoLoadingInitialized', true);

		return Ember.$.getScript(this.pontoPath);
	},

	/**
	 * Adds oasis portable infobox styles to the DOM and a class to the body element
	 *
	 * @param {Object} serverResponse
	 * @returns {Ember.RSVP.Promise}
	 */
	setupStyles(serverResponse) {
		Ember.$('body').addClass('infobox-builder-body-wrapper');

		if (serverResponse.css) {
			const html = serverResponse.css.map((url) => {
				return `<link type="text/css" rel="stylesheet" href="${url}">`;
			}).join('');

			$(html).appendTo('head');
		}
	},

	/**
	 * Accepts data received from MW and sets it on controller to be used in afterModel
	 *
	 * @param {Object} serverResponse
	 * @returns {void}
	 */
	setupInfoboxData(serverResponse) {
		const infoboxData = serverResponse.data,
			controller = this.controllerFor('infobox-builder');

		let infoboxDataParsed = null;

		if (infoboxData) {
			try {
				infoboxDataParsed = JSON.parse(infoboxData);
			} catch (e) {
				throw new Error('Could not parse infobox data as JSON');
			}
		}

		controller.set('infoboxData', infoboxDataParsed);
		controller.set('isNew', serverResponse.isNew || false);
		// explicitly set the state as dirty for new template to make sure
		// user gets prompted for confirmation on page exit / go to source
		// to avoid confusion - without explicit prompt the default new
		// infobox would disappear on a transition to source
		controller.set('isDirty', serverResponse.isNew || false);
	},

	/**
	 * Shows error message for ponto communication
	 *
	 * @param {String} message - error message
	 * @returns {void}
	 */
	showPontoError(message) {
		Ember.Logger.error('Ponto Error', message);
	},

	/**
	 * ember-onbeforeunload - message displayed within confirmation dialog
	 *
	 * @returns {String}
	 */
	confirmationMessage() {
		track({
			action: trackActions.confirm,
			category: 'infobox-builder',
			label: 'show-unsaved-changes-on-exit-prompt'
		});

		return i18n.t('infobox-builder:main.leave-confirmation');
	}
});
