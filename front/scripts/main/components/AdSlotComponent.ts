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

	nameLowerCase: function () {
		return this.get('name').toLowerCase().dasherize();
	}.property('name'),

	// noAds is being passed from ApplicationController
	noAds: function (key: string, value: any) {
		if (value === '' || value === '0') {
			Em.Logger.info('Injected ad:', this.get('name'));
			Mercury.Modules.Ads.getInstance().addSlot(this.get('name'));
			return false;
		} else {
			Em.Logger.info('Ad disabled for:', this.get('name'));
			return true;
		}
	}.property(),

	willDestroyElement: function() {
		var name = this.get('name');

		Mercury.Modules.Ads.getInstance().removeSlot(this.get('name'));

		this.$().remove();

		Em.Logger.info('Will destroy ad:', name);
	}
});
