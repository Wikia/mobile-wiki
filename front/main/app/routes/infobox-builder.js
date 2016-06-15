import Ember from 'ember';
import InfoboxBuilderModel from '../models/infobox-builder';
import ConfirmationMixin from 'ember-onbeforeunload/mixins/confirmation';
import {track, trackActions} from 'common/utils/track';

export default Ember.Route.extend(ConfirmationMixin, {
	ajax: Ember.inject.service(),
	resourceLoader: Ember.inject.service(),
	isIframeContext: Ember.computed(() => {
		return window.self !== window.top;
	}),
	isEnvironmentSet: false,
	cssLoaded: false,

	/**
	 * Load infobox data and additional assets with AJAX request and run methods that will handle them
	 *
	 * @param {Transition} transition
	 * @returns {Ember.RSVP.Promise}
	 */
	beforeModel(transition) {
		const templateName = transition.params['infobox-builder'].templateName;

		return new Ember.RSVP.Promise((resolve, reject) => {
			if (this.get('isIframeContext')) {
				if (!this.get('isEnvironmentSet')) {
					this.setupEnvironmentAndInfoboxData(templateName)
						.then(() => {
							this.set('isEnvironmentSet', true);
							resolve();
						})
						.catch(reject);
				} else {
					this.loadAndSetupInfoboxData(templateName)
						.then(resolve)
						.catch(reject);
				}
			} else {
				reject('Infobox builder has to be loaded in an iframe');
			}
		});
	},

	/**
	 * @param {Object} params
	 * @returns {Object}
	 */
	model({templateName}) {
		return InfoboxBuilderModel.create({
			title: templateName
		});
	},

	/**
	 * Uses data loaded in beforeModel to set model properties
	 *
	 * @param {Object} model
	 * @returns {void}
	 */
	afterModel(model) {
		const controller = this.controllerFor('infobox-builder');

		this.controllerFor('infobox-builder').set('initialTitle', model.get('title'));
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
		 * Connects with ponto and redirects to page from url if given.
		 * If url not passed, redirect to previously visited page.
		 *
		 * @param {String} url
		 * @returns {Ember.RSVP.Promise}
		 */
		redirectToPage(url) {
			const action = url ?
				'redirectToPage' :
				'redirectToPreviousPage';

			return new Ember.RSVP.Promise((resolve, reject) => {
				const ponto = window.Ponto;

				ponto.invoke(
					'wikia.infoboxBuilder.ponto',
					action,
					url,
					(data) => resolve(data),
					(data) => {
						reject(data);
						this.showPontoError(data);
					},
					false
				);
			});
		},

		returnToVE(title = null) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				const ponto = window.Ponto;

				if ( this.refresh().isAborted ) {
					return false;
				}

				ponto.invoke(
					'wikia.infoboxBuilder.ponto',
					'returnToVE',
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

		/**
		 * redirects to source editor
		 * @param {String} title
		 * @returns {void}
		 */
		goToSourceEditor(title) {
			this.getRedirectUrls(title)
				.then((urls) => {
					this.send('redirectToPage', urls.sourceEditorUrl);
				})
				.catch((error) => {
					Ember.Logger.error('Error while getting redirect Urls: ', error);
				});
		}
	},

	/**
	 * Load CSS assets from MedaWiki
	 * @returns {Promise}
	 */
	loadCss() {
		const resourceLoader = this.get('resourceLoader');

		if (this.get('cssLoaded')) {
			return Ember.RSVP.resolve(resourceLoader.assetAlreadyLoadedStatusName);
		}
		return this.get('ajax').request(M.buildUrl({path: '/wikia.php'}), {
			data: {
				controller: 'PortableInfoboxBuilderController',
				method: 'getAssets',
				format: 'json'
			}
		}).then((data) => {
			if (data && data.css) {
				return resourceLoader.load('portableInfoboxBuilderCss', {type: 'css', paths: data.css});
			} else {
				throw Error('Invalid assets data was returned from MediaWiki API');
			}
		}).then((result) => {
			this.set('cssLoaded', true);
			return result;
		});
	},

	/**
	 * Setup infobox builder by loading infobox data and styles.
	 * Also initialize ponto and checks in what context
	 * infobox builder was opened
	 *
	 * @param {string} templateName
	 * @returns {Promise}
	 */
	setupEnvironmentAndInfoboxData(templateName) {
		const resourceLoader = this.get('resourceLoader'),
			promises = {
				data: this.loadInfoboxData(templateName),
				assets: this.loadCss(),
				ponto: resourceLoader.load('pontoJs')
			};

		return Ember.RSVP.hash(promises)
			.then((response) => {
				this.setupInfoboxData(response.data);
				if (response.assets === resourceLoader.assetJustAddedStatusName) {
					Ember.$('body').addClass('infobox-builder-body-wrapper');
				}
			})
			.then(this.isWikiaContext.bind(this));
	},

	/**
	 * Setup infobox data.
	 * It's invoke on model refresh
	 * to avoid loading all existing resources again
	 *
	 * @param {string} templateName
	 * @returns {Promise}
	 */
	loadAndSetupInfoboxData(templateName) {
		return this.loadInfoboxData(templateName)
			.then((response) => {
				this.setupInfoboxData(response);
			});
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
						this.setVEContext(data.isVEContext);
						resolve();
					} else {
						reject('Builder launched not in Wikia context');
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
	loadInfoboxData(templateName) {
		if (!templateName) {
			// Return data field as PortableInfoboxBuilderController does for new infobox
			return Ember.RSVP.resolve({
				data: '{}',
				isNew: true
			});
		}
		return this.get('ajax').request(M.buildUrl({path: '/wikia.php'}), {
			data: {
				controller: 'PortableInfoboxBuilderController',
				method: 'getData',
				format: 'json',
				title: templateName
			}
		}).then((data) => {
			if (data && data.data) {
				return data;
			} else {
				throw new Error('Invalid data was returned from Infobox Builder API');
			}
		});
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
	},

	/**
	 * send request to backend for redirect urls
	 * @param {String} title
	 * @returns {Ember.RSVP.Promise}
	 */
	getRedirectUrls(title) {
		return this.get('ajax').request(M.buildUrl({path: '/wikia.php'}), {
			data: {
				controller: 'PortableInfoboxBuilderController',
				method: 'getRedirectUrls',
				title
			},
		}).then((data) => {
			if (data && data.success) {
				return data.urls;
			} else {
				throw new Error(data.errors);
			}
		});
	},

	/**
	 * set VE context - true if IB opened inside visual editor
	 * @param {Boolean} isVEContext
	 * @returns {void}
	 */
	setVEContext(isVEContext = false) {
		this.controllerFor('infobox-builder').set('isVEContext', isVEContext);
	}
});
