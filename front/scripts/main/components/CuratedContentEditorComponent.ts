/// <reference path="../app.ts" />
'use strict';

App.CuratedContentEditorComponent = Em.Component.extend(App.LoadingSpinnerMixin, {
	classNames: ['curated-content-editor'],

	actions: {
		addBlockItem(block: string): void {
			this.sendAction('addBlockItem', block);
		},

		editBlockItem(item: CuratedContentEditorItemModel, block: string): void {
			this.sendAction('editBlockItem', item, block);
		},

		addSection(): void {
			this.sendAction('addSection');
		},

		openSection(item: CuratedContentEditorItemModel): void {
			this.sendAction('openSection', item);
		},

		save(): void {
			this.showLoader();
			App.CuratedContentEditorModel.save(this.get('model'))
				.then((data: any): void => {
					//TODO: V
				})
				.catch((err: any): void => {
					//TODO: V
				})
				.finally((): void => {
					this.hideLoader();
				});
		}
	}
});
