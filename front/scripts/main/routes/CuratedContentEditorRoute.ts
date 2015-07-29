/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorRoute = Em.Route.extend({
	model(): Em.RSVP.Promise {
		return App.CuratedContentEditorModel.load();
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

		save(): void {
			App.CuratedContentEditorModel.save(this.modelFor('curatedContentEditor'));
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
