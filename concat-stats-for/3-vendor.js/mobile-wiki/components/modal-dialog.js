define('mobile-wiki/components/modal-dialog', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var alias = Ember.computed.alias;
	var Component = Ember.Component;
	exports.default = Component.extend({
		classNameBindings: ['type', 'closeOnOverlayClick::layover-cursor-auto', 'additionalClass'],
		classNames: ['modal-dialog-wrapper'],
		additionalClass: alias('modalDialog.name'),
		closeOnOverlayClick: true,
		isVisible: false,
		modalDialog: service(),
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