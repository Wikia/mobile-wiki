/// <reference path="../app.ts" />

'use strict';

App.ModalDialogComponent = Em.Component.extend({
	classNames: ['modal-dialog-wrapper'],
	classNameBindings: ['type'],
	type: 'info',
	isVisible: false,

	actions: {
		/**
		 * @returns {void}
		 */
		close(): void {
			this.set('isVisible', false);
		},
	},
});
