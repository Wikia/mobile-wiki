/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderEditItemComponent = Em.Component.extend({
	actions: {
		removeItem: function(): void {
			this.sendAction('removeItemAction', this.get('item'));
		},
		moveItemUp: function(): void {
			this.sendAction('moveItemAction', -1, this.get('item'));
		},
		moveItemDown: function(): void {
			this.sendAction('moveItemAction', 1, this.get('item'));
		}
	}
});
