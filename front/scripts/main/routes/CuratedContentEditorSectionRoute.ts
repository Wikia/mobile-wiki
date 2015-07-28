/// <reference path="../app.ts" />
/// <reference path="../../../../typings/ember/ember.d.ts" />

'use strict';

App.CuratedContentEditorSectionRoute = Em.Route.extend({
	serialize(model: CuratedContentEditorItemModel): any {
		return {
			section: model.label
		};
	},

	model(params: any): CuratedContentEditorItemModel {
		var section: string = decodeURIComponent(params.section),
			rootModel: CuratedContentEditorItemModel = this.modelFor('curatedContentEditor');

		return App.CuratedContentEditorModel.getItem(rootModel['curated'], section);
	},

	setupController(controller: any, model: CuratedContentEditorItemModel, transition: EmberStates.Transition): void {
		this._super(controller, model, transition);
		controller.setProperties({
			originalSectionLabel: model.label
		});
	},

	actions: {
		addItem(): void  {
			this.transitionTo('curatedContentEditor.section.addItem');
		},

		editItem(item: CuratedContentEditorItemModel): void {
			this.transitionTo('curatedContentEditor.section.editItem', encodeURIComponent(item.label));
		},

		editSection(): void {
			this.transitionTo('curatedContentEditor.section.edit');
		},

		done(newSection: CuratedContentEditorItemModel): void {
			var rootModel: CuratedContentEditorModel = this.modelFor('curatedContentEditor'),
				controller: any = this.controllerFor('curatedContentEditor.section'),
				originalSectionLabel: string = controller.get('originalSectionLabel'),
				isNewSection: boolean = controller.get('isNewSection');

			if (isNewSection) {
				App.CuratedContentEditorModel.addItem(rootModel['curated'], newSection);
				controller.set('isNewSection', null);
			} else {
				App.CuratedContentEditorModel.updateItem(rootModel['curated'], newSection, originalSectionLabel);
			}

			this.transitionTo('curatedContentEditor.index');
		}
	}
});
