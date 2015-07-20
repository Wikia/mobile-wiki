/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditRoute = Em.Route.extend({
	actions: {
		editItem: function(editBlockItem: CuratedContentEditBlockItemInterface): void  {
			if (editBlockItem.block) {
				this.transitionTo('curatedContentEdit.blockItem', editBlockItem);
			} else if (editBlockItem.section) {
				this.transitionTo('curatedContentEdit.sectionItem', editBlockItem);
			} else {
				this.sendAction('error');
			}
		},

		addBlockItem: function(block: string): void  {
			this.transitionTo('curatedContentEdit.addBlockItem', block);
		},

		addSectionItem: function(section: string): void  {
			this.transitionTo('curatedContentEdit.addSectionItem', section);
		},

		openSection: function (item: CuratedContentEditItemModelInterface): void {
			this.transitionTo('curatedContentEdit.section', item);
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
			if (transition.targetName.indexOf('curatedContentEdit') < 0) {
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
