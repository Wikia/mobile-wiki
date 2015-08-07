/// <reference path="../app.ts" />
///<reference path="../mixins/CuratedContentEditorLayoutMixin.ts"/>
'use strict';

App.CuratedContentEditorItemComponent = Em.Component.extend(App.CuratedContentEditorLayoutMixin, {
	editorLayout: 'curated-content-editor-item-form',

	actions: {
		goBack(): void {
			this.sendAction('goBack');
		},

		done(model: any): void {
			this.sendAction('done', model);
		},

		deleteItem(): void {
			this.sendAction('deleteItem');
		},

		changeLayout(newLayoutName: string): void {
			this.set('editorLayout', newLayoutName);
		}
	}
});
