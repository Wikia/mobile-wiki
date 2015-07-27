/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddRoute = Em.Route.extend({
	model(): typeof App.CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew({
			node_type: 'section',
			items: []
		});
	},

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		// Update section
		done(newSection: typeof App.CuratedContentEditorItemModel): void {
			var rootModel: typeof App.CuratedContentEditorModel = this.modelFor('curatedContentEditor');

			App.CuratedContentEditorModel.addItem(rootModel['curated'], newSection);
			this.transitionTo('curatedContentEditor.section', newSection);
		},

		// Delete section
		deleteItem(): void {
			this.send('goBack');
		}
	}
});
