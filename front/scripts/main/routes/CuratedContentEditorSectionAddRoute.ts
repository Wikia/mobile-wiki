/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionAddRoute = Em.Route.extend(
	App.TrackClickMixin,
	{
	model(): CuratedContentEditorItemModel {
		return App.CuratedContentEditorItemModel.createNew({
			node_type: 'section',
			items: []
		});
	},

	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		var parentSection = this.modelFor('curatedContentEditor').get('curated');
		this._super(controller, model, transition);
		controller.set('alreadyUsedLabels', App.CuratedContentEditorModel.getAlreadyUsedLabels(parentSection));
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
				queryParams: {
					isNewSection: true
				}
			});
		},

		// Delete section
		deleteItem(): void {
			this.trackClick('curated-content-editor', 'section-delete');
			this.send('goBack');
		}
	}
});
