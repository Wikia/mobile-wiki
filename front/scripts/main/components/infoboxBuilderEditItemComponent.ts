/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderEditItemComponent = Em.Component.extend({
	actions: {
		removeItem: function(): void {
			this.sendAction('removeItemAction', this.get('position'));
		}
	}
});
