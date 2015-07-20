/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorRoute = Em.Route.extend({
	model: function (): Em.RSVP.Promise {
		return App.CuratedContentEditorModel.find();
	},

	actions: {
		editItem: function(editBlockItem: CuratedContentEditorBlockItemInterface): void  {
			if (editBlockItem.block) {
				this.transitionTo('curatedContentEditor.blockItem', editBlockItem);
			} else if (editBlockItem.section) {
				this.transitionTo('curatedContentEditor.sectionItem', editBlockItem);
			} else {
				this.sendAction('error');
			}
		},

		addBlockItem: function(block: string): void  {
			this.transitionTo('curatedContentEditor.addBlockItem', block);
		},

		addSectionItem: function(section: string): void  {
			this.transitionTo('curatedContentEditor.addSectionItem', section);
		},

		openSection: function (item: CuratedContentEditorItemInterface): void {
			this.transitionTo('curatedContentEditor.section', item);
		},

		error: function (error: any): boolean {
			this.controllerFor('application').addAlert('warning', i18n.t('app.curated-content-error-other'));
			this.transitionTo('mainPage');
			return true;
		},

		/**
		 * TODO (CONCF-856): This is a quick fix copied from EditRoute, not a clean solution.
		 *
		 * @param transition
		 * @returns {boolean}
		 */
		willTransition: function(transition: EmberStates.Transition): boolean {
			if (transition.targetName.indexOf('curatedContentEditor') < 0) {
				transition.then(() => {
					this.controllerFor('application').set('fullPage', false);
				});
			}
			return true;
		},

		didTransition: function(): boolean {
			this.controllerFor('application').set('fullPage', true);
			window.scrollTo(0, 0);
			return true;
		}
	}
});
