import Ember from 'ember';
import CuratedContentEditorModel from '../models/curated-content-editor';
import {track, trackActions} from 'common/utils/track';

export default Ember.Route.extend(
	{
		/**
		 * @returns {void}
		 */
		beforeModel() {
			if (!$().cropper || !this.get('cropperLoadingInitialized')) {
				this.suppressDefineAmd(
					this.loadCropper()
				);
			}

			if (window.self !== window.top && (
					(!window.Ponto || !this.get('pontoLoadingInitialized'))
				)
			) {
				this.suppressDefineAmd(
					this.loadPonto()
				);
			}
		},

		/**
		 * @returns {Ember.RSVP.Promise} model
		 */
		model() {
			return CuratedContentEditorModel.load();
		},

		/**
		 * This is needed as libs used by us will initialize themself as modules if define.amd is truthy
		 * define.amd might be truthy here if ads code is loaded before
		 *
		 * This will be not needed when we move to module system
		 *
		 * @param {JQueryXHR} promise
		 * @returns {void}
		 */
		suppressDefineAmd(promise) {
			let oldAmd;

			if (window.define) {
				oldAmd = window.define.amd;
				window.define.amd = false;

				promise.then(() => {
					window.define.amd = oldAmd;
				});
			}
		},

		cropperLoadingInitialized: false,

		/**
		 * Loads Cropper css and js
		 *
		 * @returns {JQueryXHR} cropper
		 */
		loadCropper() {
			const cssPath = '/front/main/assets/vendor/cropper/cropper.min.css',
				jsPath = '/front/main/assets/vendor/cropper/cropper.min.js';

			this.set('cropperLoadingInitialized', true);

			$('<link>')
				.attr({type: 'text/css', rel: 'stylesheet'})
				.attr('href', cssPath)
				.appendTo('head');

			return Ember.$.getScript(jsPath);
		},

		pontoLoadingInitialized: false,

		/**
		 * Loads Ponto
		 *
		 * @returns {JQueryXHR} pronto
		 */
		loadPonto() {
			const jsPath = '/front/main/assets/vendor/ponto/ponto.js';

			this.set('pontoLoadingInitialized', true);

			return Ember.$.getScript(jsPath, () => {
				const ponto = window.Ponto;

				if (ponto && typeof ponto.setTarget === 'function') {
					ponto.setTarget(ponto.TARGET_IFRAME_PARENT, window.location.origin);
				}
			});
		},

		actions: {
			/**
			 * @param {string} block
			 * @returns {void}
			 */
			addBlockItem(block) {
				track({
					action: trackActions.click,
					category: 'curated-content-editor',
					label: 'item-add'
				});
				this.transitionTo('curatedContentEditor.blockAddItem', block);
			},
			/**
			 * @param {CuratedContentEditorItemModel} item
			 * @param {string} block
			 * @returns {void}
			 */
			editBlockItem(item, block) {
				track({
					action: trackActions.click,
					category: 'curated-content-editor',
					label: 'item-edit'
				});
				this.transitionTo('curatedContentEditor.blockEditItem', block, encodeURIComponent(item.label));
			},

			editCommunityData() {
				track({
					action: trackActions.click,
					category: 'curated-content-editor',
					label: 'community-data-edit'
				});
				this.transitionTo('curatedContentEditor.communityData');
			},

			/**
			 * @returns {void}
			 */
			addSection() {
				track({
					action: trackActions.click,
					category: 'curated-content-editor',
					label: 'section-add'
				});
				this.transitionTo('curatedContentEditor.sectionAdd');
			},

			/**
			 * @param {CuratedContentEditorItemModel} section
			 * @returns {void}
			 */
			openSection(section) {
				track({
					action: trackActions.click,
					category: 'curated-content-editor',
					label: 'section-open'
				});
				this.transitionTo('curatedContentEditor.section', encodeURIComponent(section.label));
			},

			/**
			 * @param {Boolean} dataSaved it's a flag whether data was saved or not
			 * @returns {void}
			 */
			openMainPage(dataSaved) {
				this.handleTransitionToMainPage(dataSaved);
			},

			/**
			 * @param {Object} error
			 * @returns {Boolean} returns true
			 */
			error(error) {
				if (error.status === 403) {
					this.controllerFor('application').addAlert({
						message: i18n.t('app.curated-content-editor-error-no-access-permissions'),
						type: 'warning'
					});
					this.handleTransitionToMainPage();
				} else {
					Ember.Logger.error(error);
					this.controllerFor('application').addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'warning'
					});
					this.transitionTo('curatedContentEditor');
				}
				return true;
			},

			/**
			 * @todo (CONCF-856): This is a quick fix copied from EditRoute, not a clean solution.
			 *
			 * @param {EmberState.Transition} transition
			 * @returns {Boolean} returns true
			 */
			willTransition(transition) {
				const isStayingOnEditor = transition.targetName.indexOf('curatedContentEditor') > -1;

				if (
					CuratedContentEditorModel.isDirty &&
					!isStayingOnEditor &&
					!this.get('publish') &&
					!confirm(i18n.t('app.curated-content-editor-exit-prompt'))
				) {
					transition.abort();
				}

				if (!isStayingOnEditor) {
					transition.then(() => {
						this.controllerFor('application').set('fullPage', false);
					});
				}

				return true;
			},

			/**
			 * @returns {Boolean} returns true
			 */
			didTransition() {
				this.controllerFor('application').set('fullPage', true);
				return true;
			}
		},

		/**
		 * Called when user clicks on custom back button or after data is saved
		 * Does transition to the main page or sends a message through Ponto if available
		 *
		 * @param {Boolean} dataSaved=false it's a flag whether data was saved or not
		 * @returns {void}
		 */
		handleTransitionToMainPage(dataSaved = false) {
			const ponto = window.Ponto;

			this.set('publish', Boolean(dataSaved));

			if (ponto && typeof ponto.invoke === 'function') {
				this.closeModalUsingPonto(ponto);
			} else {
				this.transitionTo('wiki-page', Ember.get(Mercury, 'wiki.mainPageTitle'));
			}
		},

		/**
		 * @param {Object} ponto
		 * @returns {void}
		 */
		closeModalUsingPonto(ponto) {
			const dataSaved = this.get('publish');

			if (
				CuratedContentEditorModel.isDirty &&
				!dataSaved &&
				!confirm(i18n.t('app.curated-content-editor-exit-prompt'))
			) {
				return;
			}

			ponto.invoke(
				// AMD module name in app
				'curatedContentTool.pontoBridge',
				// Method to invoke
				'exit',
				{
					saved: dataSaved
				},
				// We don't care about success callback
				Ember.K,
				// If something went wrong on the app side then display an error
				// This shouldn't happen, ever
				(err) => {
					Ember.Logger.error('Ponto error:', err);

					this.controllerFor('application').addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'alert'
					});
				},
				true
			);
		}
	});
