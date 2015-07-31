/// <reference path="../app.ts" />
/// <reference path="../mixins/ViewportMixin.ts" />
'use strict';

App.ModalDialogComponent = Em.Component.extend(App.ViewportMixin, {
	classNames: ['modal-dialog'],
	isVisible: false,

	content: null,

	actions: {
		close(): void {
			this.set('isVisible', false);
		}
	}
});
