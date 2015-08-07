/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorRoute = Em.Route.extend({
	model(): Em.RSVP.Promise {
		return App.CuratedContentEditorModel.load();
	},

	beforeModel(): JQueryXHR {
		if (!$().cropper || !this.get('cropperLoadingInitialized')) {
			return this.suppressDefineAmd(
				this.loadCropper()
			);
		}
	},

	/**
	 * This is needed as by default cropper will initialize itself as module
	 * if define.amd is truthy
	 * define.amd might be truthy here if ads code is loaded before
	 *
	 * This will be not neeede when we move to module system
	 *
	 * @param {JQueryXHR} promise
	 * @returns {JQueryXHR}
	 */
	suppressDefineAmd(promise: JQueryXHR) {
		var oldAmd: any;

		if (window.define) {
			oldAmd = window.define.amd;
			window.define.amd = false;

			return promise.then((): void => {
				window.define.amd = oldAmd;
			});
		}

		return promise;
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
			.attr({type : 'text/css', rel : 'stylesheet'})
			.attr('href', `${this.cropperPath}/cropper.min.css`)
			.appendTo('head');

		return Em.$.getScript(`${this.cropperPath}/cropper.min.js`);
	},

	actions: {
		addBlockItem(block: string): void {
			this.transitionTo('curatedContentEditor.blockAddItem', block);
		},

		editBlockItem(item: CuratedContentEditorItemModel, block: string): void {
			this.transitionTo('curatedContentEditor.blockEditItem', block, encodeURIComponent(item.label));
		},

		addSection(): void {
			this.transitionTo('curatedContentEditor.sectionAdd');
		},

		openSection(item: CuratedContentEditorItemModel): void {
			this.transitionTo('curatedContentEditor.section', encodeURIComponent(item.label));
		},

		openMainPage(): void {
			this.transitionTo('mainPage');
		},

		error(error: any): boolean {
			Em.Logger.error(error);
			this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-other'));
			this.transitionTo('curatedContentEditor');
			return true;
		},

		/**
		 * TODO (CONCF-856): This is a quick fix copied from EditRoute, not a clean solution.
		 *
		 * @param transition
		 * @returns {boolean}
		 */
		willTransition(transition: EmberStates.Transition): boolean {
			if (transition.targetName.indexOf('curatedContentEditor') < 0) {
				transition.then(() => {
					this.controllerFor('application').set('fullPage', false);
				});
			}
			return true;
		},

		didTransition(): boolean {
			this.controllerFor('application').set('fullPage', true);
			window.scrollTo(0, 0);
			return true;
		}
	}
});
