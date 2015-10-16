/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />
/// <reference path="../mixins/TrackClickMixin.ts"/>

'use strict';

interface Window {
	Ponto: any
}

App.CuratedContentEditorRoute = Em.Route.extend(
	App.TrackClickMixin,
	{
		beforeModel(): void {
			if (!$().cropper || !this.get('cropperLoadingInitialized')) {
				this.suppressDefineAmd(
					this.loadCropper()
				);
			}

			if (window.self !== window.top && (
					!window.Ponto || !this.get('pontoLoadingInitialized')
				)
			) {
				this.suppressDefineAmd(
					this.loadPonto()
				);
			}
		},

		model(): Em.RSVP.Promise {
			return App.CuratedContentEditorModel.load();
		},

		/**
		 * This is needed as libs used by us will initialize themself as modules if define.amd is truthy
		 * define.amd might be truthy here if ads code is loaded before
		 *
		 * This will be not needed when we move to module system
		 *
		 * @param {JQueryXHR} promise
		 * @returns {JQueryXHR}
		 */
		suppressDefineAmd(promise: JQueryXHR) {
			var oldAmd: any;

			if (window.define) {
				oldAmd = window.define.amd;
				window.define.amd = false;

				promise.then((): void => {
					window.define.amd = oldAmd;
				});
			}
		},

		cropperLoadingInitialized: false,
		cropperPath: '/front/vendor/cropper/dist',

		/**
		 * Loads Cropper css and js
		 *
		 * @returns {JQueryXHR}
		 */
		loadCropper(): JQueryXHR {
			this.set('cropperLoadingInitialized', true);

			$('<link>')
				.attr({type: 'text/css', rel: 'stylesheet'})
				.attr('href', `${this.cropperPath}/cropper.min.css`)
				.appendTo('head');

			return Em.$.getScript(`${this.cropperPath}/cropper.min.js`);
		},

		pontoLoadingInitialized: false,
		pontoPath: '/front/vendor/ponto/web/src/ponto.js',

		loadPonto(): JQueryXHR {
			this.set('pontoLoadingInitialized', true);

			return Em.$.getScript(this.pontoPath, (): void => {
				var ponto = window.Ponto;

				if (ponto && typeof ponto.setTarget === 'function') {
					ponto.setTarget(ponto.TARGET_IFRAME_PARENT, window.location.origin);
				}
			});
		},

		actions: {
			addBlockItem(block: string): void {
				this.trackClick('curated-content-editor', 'item-add');
				this.transitionTo('curatedContentEditor.blockAddItem', block);
			},

			editBlockItem(item: CuratedContentEditorItemModel, block: string): void {
				this.trackClick('curated-content-editor', 'item-edit');
				this.transitionTo('curatedContentEditor.blockEditItem', block, encodeURIComponent(item.label));
			},

			addSection(): void {
				this.trackClick('curated-content-editor', 'section-add');
				this.transitionTo('curatedContentEditor.sectionAdd');
			},

			openSection(item: CuratedContentEditorItemModel): void {
				this.trackClick('curated-content-editor', 'section-open');
				this.transitionTo('curatedContentEditor.section', encodeURIComponent(item.label));
			},

			openMainPage(dataSaved: boolean = false): void {
				this.handleTransitionToMainPage(dataSaved);
			},

			error(error: any): boolean {
				if (error.status === 403) {
					this.controllerFor('application').addAlert({
						message: i18n.t('app.curated-content-editor-error-no-access-permissions'),
						type: 'warning'
					});
					this.handleTransitionToMainPage();
				} else {
					Em.Logger.error(error);
					this.controllerFor('application').addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'warning'
					});
					this.transitionTo('curatedContentEditor');
				}
				return true;
			},

			/**
			 * TODO (CONCF-856): This is a quick fix copied from EditRoute, not a clean solution.
			 *
			 * @param transition
			 * @returns {boolean}
			 */
			willTransition(transition: EmberStates.Transition): boolean {
				var isStayingOnEditor: boolean = transition.targetName.indexOf('curatedContentEditor') > -1;

				if (
					App.CuratedContentEditorModel.isDirty &&
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

			didTransition(): boolean {
				this.controllerFor('application').set('fullPage', true);
				return true;
			}
		},

		/**
		 * Called when user clicks on custom back button or after data is saved
		 * Does transition to the main page or sends a message through Ponto if available
		 *
		 * @param dataSaved
		 */
		handleTransitionToMainPage(dataSaved: boolean = false): void {
			var ponto = window.Ponto;

			this.set('publish', !!dataSaved);

			if (ponto && typeof ponto.invoke === 'function') {
				this.closeModalUsingPonto(ponto);
			} else {
				this.transitionTo('mainPage');
			}
		},

		closeModalUsingPonto(ponto: any): void {
			var dataSaved = this.get('publish');

			if (App.CuratedContentEditorModel.isDirty &&
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
				Em.K,
				// If something went wrong on the app side then display an error
				// This shouldn't happen, ever
				(err: any): void => {
					Em.Logger.error('Ponto error:', err);

					this.controllerFor('application').addAlert({
						message: i18n.t('app.curated-content-error-other'),
						type: 'alert'
					});
				},
				true
			);
		}
	});
