/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionEditRoute = Em.Route.extend({
	model(): CuratedContentEditorItemModel {
		return this.modelFor('curatedContentEditor.section');
	},

	getOtherItemLabels(label: string = null): string[] {
		var items = this.modelFor('curatedContentEditor').get('curated').items;

		return items.map((item: CuratedContentEditorItemModel): string => {
				return item.label !== label ? item.label : null
			}).filter(String);
	},

	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		this._super(controller, model, transition);
		controller.set('otherItemLabels', this.getOtherItemLabels(model.label));
	},

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			var sectionModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');
			this.transitionTo('curatedContentEditor.section', encodeURIComponent(sectionModel.label));
		},

		// Update section
		done(newSection: CuratedContentEditorItemModel): void {
			var sectionModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor.section');

			Em.setProperties(sectionModel, newSection);
			this.transitionTo('curatedContentEditor.section.index');
		},

		// Delete section
		deleteItem(): void {
			var rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				controller: any = this.controllerFor('curatedContentEditor.section'),
				originalSectionLabel: string = controller.get('originalSectionLabel');

			App.CuratedContentEditorModel.deleteItem(rootModel['curated'], originalSectionLabel);
			this.transitionTo('curatedContentEditor.index');
		}
	}
});
