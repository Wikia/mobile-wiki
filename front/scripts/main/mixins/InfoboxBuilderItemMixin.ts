/// <reference path="../app.ts" />

'use strict';

App.InfoboxBuilderItemMixin = Em.Mixin.create({
	activeClass: Ember.computed('position', 'activeItemPosition', function(): string {
		return this.get('position') === this.get('activeItemPosition') ? 'active' : '';
	}),
	actions: {
		itemClicked: function(): void {
			this.sendAction('setEditItemAction', this.get('item'), this.get('position'));
		}
	}
});
