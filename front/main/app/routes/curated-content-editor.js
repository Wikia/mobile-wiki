import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import CuratedContentEditorModel from '../models/curated-content-editor';

export default Ember.Route.extend(
	TrackClickMixin,
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
		cropperPath: '/front/vendor/cropper/dist',

		/**
		 * Loads Cropper css and js
		 *
		 * @returns {JQueryXHR} cropper
		 */
		loadCropper() {
			this.set('cropperLoadingInitialized', true);

			$('<link>')
				.attr({type: 'text/css', rel: 'stylesheet'})
				.attr('href', `${this.cropperPath}/cropper.min.css`)
				.appendTo('head');

			return Ember.$.getScript(`${this.cropperPath}/cropper.min.js`);
		},

		pontoLoadingInitialized: false,
		pontoPath: '/front/vendor/ponto/web/src/ponto.js',

		/**
		 * Loads Ponto
		 *
		 * @returns {JQueryXHR} pronto
		 */
		loadPonto() {
			this.set('pontoLoadingInitialized', true);

			return Ember.$.getScript(this.pontoPath, () => {
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
				this.trackClick('curated-content-editor', 'item-add');
				this.transitionTo('curatedContentEditor.blockAddItem', block);
			},
			/**
			 * @param {CuratedContentEditorItemModel} item
			 * @param {string} block
			 * @returns {void}
			 */
			editBlockItem(item, block) {
				this.trackClick('curated-content-editor', 'item-edit');
				this.transitionTo('curatedContentEditor.blockEditItem', block, encodeURIComponent(item.label));
			},

			/**
			 * @returns {void}
			 */
			addSection() {
				this.trackClick('curated-content-editor', 'section-add');
				this.transitionTo('curatedContentEditor.sectionAdd');
			},

			/**
			 * @param {CuratedContentEditorItemModel} section
			 * @returns {void}
			 */
			openSection(section) {
				this.trackClick('curated-content-editor', 'section-open');
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
				this.transitionTo('mainPage');
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
