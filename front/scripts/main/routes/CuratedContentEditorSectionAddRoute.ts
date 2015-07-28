/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddRoute = Em.Route.extend({
	model(): CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew({
			node_type: 'section',
			items: []
		});
	},

	getAlreadyUsedLabels(): string[] {
		var items = this.modelFor('curatedContentEditor').get('curated').items;

		return items.map((item: CuratedContentEditorItemModel): string => { return item.label }).filter(String);
	},

	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		this._super(controller, model, transition);
		controller.set('alreadyUsedLabels', this.getAlreadyUsedLabels());
	},

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		done(newSection: CuratedContentEditorItemModel): void {
			this.transitionTo('curatedContentEditor.section', newSection);
		},

		// Delete section
		deleteItem(): void {
			this.send('goBack');
		}
	}
});
