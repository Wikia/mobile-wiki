/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface CuratedContentEditorEditSectionItemRouteParamsInterface {
	section: string;
	item: string;
}

App.CuratedContentEditorEditSectionItemRoute = Em.Route.extend({
	/**
	 * @desc If model wasn't passed to the route (on page refresh) we redirect to /main/edit
	 *
	 * @param transition
	 */
	beforeModel: function (transition: any): void {
		if (!Em.isArray(transition.intent.contexts)) {
			this.transitionTo('curatedContentEditor.index');
		}
	},

	model: function(params: CuratedContentEditorEditSectionItemRouteParamsInterface) {
		var section = params.section,
			item = params.item,
			itemModel = App.CuratedContentEditorModel.getSectionItem(this.modelFor('curatedContentEditor'), section, item);
		return {
			section: section,
			item: itemModel
		};
	},

	setupController: function (controller: any, model: any) {
		this._super(controller, model);
		controller.set('model.originalItem', $.extend({}, model.item));
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			var section = encodeURIComponent(this.modelFor('curatedContentEditor.editSectionItem').section);
			this.transitionTo('curatedContentEditor.section', section);
		},

		updateItem: function (updatedEditItemModel: CuratedContentEditorItemInterface) {
			var section: string = this.modelFor('curatedContentEditor.editSectionItem').section,
				item = this.modelFor('curatedContentEditor.editSectionItem').originalItem,
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				updatedModel: typeof App.CuratedContentEditorModel;

			debugger;
			updatedModel = App.CuratedContentEditorModel.updateSectionItem(currentModel, updatedEditItemModel, section, item);
			currentModel.set('model', updatedModel);

			this.transitionTo('curatedContentEditor.section', encodeURIComponent(section));
		}
	}
});
