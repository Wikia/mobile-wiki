define('mobile-wiki/components/modal-dialog', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend({
		classNameBindings: ['type', 'closeOnOverlayClick::layover-cursor-auto', 'additionalClass'],
		classNames: ['modal-dialog-wrapper'],
		additionalClass: Ember.computed.alias('modalDialog.name'),
		closeOnOverlayClick: true,
		isVisible: false,
		modalDialog: Ember.inject.service(),
		onOverlayClose: function onOverlayClose() {},

		type: 'info',

		actions: {
			/**
    * @returns {void}
    */
			close: function close() {
				if (this.get('closeOnOverlayClick')) {
					this.set('isVisible', false);
					this.get('modalDialog').close();
					this.onOverlayClose();
				}
			}
		}
	});
});