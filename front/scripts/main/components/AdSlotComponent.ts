/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../../mercury/modules/Ads.ts" />

'use strict';

App.AdSlotComponent = Em.Component.extend({
	classNames: ['ad-slot-wrapper'],
	classNameBindings: ['nameLowerCase', 'noAds'],
	//This component is created dynamically, and this won't work without it
	layoutName: 'components/ad-slot',

	name: null,

	nameLowerCase: Em.computed('name', function () {
		return this.get('name').toLowerCase().dasherize();
	}),

	/**
	 * noAds is being passed from ApplicationController (queryParams)
	 * as a string and is converted to boolean here
	 *
	 * The same is happening in AdEngine2PageTypeService.class.php
	 * $wgRequest->getBool('noads', false)
	 *
	 * If getter is accessed before setter (before Ember cache is filled with value)
	 * the default is false (show ads)
	 */
	noAds: Em.computed({
		get(): boolean {
			return false;
		},
		set(key: string, value: string): boolean {
			return value !== '' && value !== '0'
		}
	}),

	didInsertElement: function (): void {
		if (this.get('noAds') === true) {
			Em.Logger.info('Ad disabled for:', this.get('name'));
		} else {
			Em.Logger.info('Injected ad:', this.get('name'));
			Mercury.Modules.Ads.getInstance().addSlot(this.get('name'));
		}
	},

	willDestroyElement: function(): void {
		var name = this.get('name');

		Mercury.Modules.Ads.getInstance().removeSlot(this.get('name'));

		this.$().remove();

		Em.Logger.info('Will destroy ad:', name);
	}
});
