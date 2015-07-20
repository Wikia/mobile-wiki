/// <reference path="../app.ts" />
'use strict';
interface CuratedContentEditorBlockItemInterface {
	block?: string;
	section?: string;
	item: CuratedContentEditorItemInterface
}

App.CuratedContentEditorBlockComponent = Em.Component.extend({
	classNames: ['curated-content-editor-block'],
	tagName: 'section',

	actions: {
		editItem: function (item: CuratedContentEditorItemInterface): void {
			var model = this.get('model'),
				block = this.get('block');

			if (block) {
				this.sendAction('editItem', {
					block: block,
					item: item
				});
			} else {
				this.sendAction('editItem', item);
			}
		},

		addItem: function (): void {
			this.sendAction('addBlockItem', this.get('block'));
		},

		openSection: function (item: CuratedContentEditorItemInterface): void {
			this.sendAction('openSection', item);
		}
	}
});
