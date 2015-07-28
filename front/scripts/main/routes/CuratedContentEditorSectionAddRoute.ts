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

	renderTemplate(): void {
		this.render('curated-content-editor-item');
	},

	actions: {
		goBack(): void {
			this.transitionTo('curatedContentEditor.index');
		},

		done(newSection: CuratedContentEditorItemModel): void {
			this.transitionTo('curatedContentEditor.section', newSection, {
				queryParams: {isNewSection: true}
			});
		},

		// Delete section
		deleteItem(): void {
			this.send('goBack');
		}
	}
});
