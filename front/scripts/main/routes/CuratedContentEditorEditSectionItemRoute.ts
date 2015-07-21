/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

interface CuratedContentEditorEditSectionItemRouteParamsInterface {
	section: string;
	item: CuratedContentEditorItemInterface
}

App.CuratedContentEditorSectionItemRoute = Em.Route.extend({
	serialize: function (model: CuratedContentEditorEditSectionItemRouteParamsInterface) {
		return {
			// Sections have titles, section items have labels and titles - we want to show labels for them
			section: encodeURIComponent(model.section),
			item: encodeURIComponent(model.item.label || model.item.title)
		};
	},

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

	setupController: function (controller: any, model: any) {
		this._super(controller, model);
		controller.set('model.originalItem', $.extend({}, model.item));
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			// We wouldn't get here without being in section route before. Model is already there so let's reuse it.
			// Going back cancels all changes made.
			this.transitionTo('curatedContentEditor.section', this.modelFor('curatedContentEditor.section'));
		},

		updateItem: function (updatedEditItemModel: CuratedContentEditorItemInterface) {
			debugger;
			var section = this.modelFor('curatedContentEditor.sectionItem').section,
				item = this.modelFor('curatedContentEditor.sectionItem').originalItem,
				currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor').get('originalCuratedContent'),
				updatedModel: typeof App.CuratedContentEditorModel;

			updatedModel = App.CuratedContentEditorModel.updateSectionItem(currentModel, updatedEditItemModel, section, item);
			currentModel.set('model', updatedModel);
			this.transitionTo('curatedContentEditor.section');
		}
	}
});
