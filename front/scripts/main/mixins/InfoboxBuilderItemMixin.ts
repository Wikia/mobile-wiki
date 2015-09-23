/// <reference path="../app.ts" />

'use strict';

App.InfoboxBuilderItemMixin = Em.Mixin.create({
	activeClass: Ember.computed('item', 'activeItem', function(): string {
		return this.get('item') === this.get('activeItem') ? 'active' : '';
	}),
	actions: {
		itemClicked: function(): void {
			this.sendAction('setEditItemAction', this.get('item'));
		}
	}
});
