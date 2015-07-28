/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddRoute = Em.Route.extend({
	model: function (): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew({
			node_type: 'section',
			items: []
		});
	},

	getOtherItemLabels: function (): string[] {
		var items = this.modelFor('curatedContentEditor').get('curated').items;

		return items.map((item: CuratedContentEditorItemInterface): string => { return item.label }).filter(String);
	},

	setupController: function (controller: any, model: typeof App.CuratedContentEditorItemModel): void {
		this._super(controller, model);
		controller.set('otherItemLabels', this.getOtherItemLabels());
	},

	renderTemplate: function (): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack: function (): void {
			this.transitionTo('curatedContentEditor.index');
		},

		// Update section
		updateItem: function (newSection: CuratedContentEditorItemInterface): void {
			var currentModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.addBlockItem(currentModel, newSection, 'curated');
			this.transitionTo('curatedContentEditor.section', newSection);
		},

		// Delete section
		deleteItem(): void {
			this.send('goBack');
		}
	}
});
