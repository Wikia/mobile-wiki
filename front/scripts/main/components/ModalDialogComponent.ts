/// <reference path="../app.ts" />

'use strict';

App.ModalDialogComponent = Em.Component.extend({
	classNames: ['modal-dialog'],
	isVisible: false,

	actions: {
		close(): void {
			this.set('isVisible', false);
		}
	}
});
