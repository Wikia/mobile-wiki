/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
/// <reference path="../../mercury/modules/Ads.ts" />

'use strict';

App.AdSlotComponent = Em.Component.extend({
	layoutName: 'components/ad-slot',
	classNames: ['ad-slot-wrapper'],
	classNameBindings: ['nameLowerCase'],

	nameLowerCase: function () {
		return this.get('name').toLowerCase().dasherize();
	}.property('name'),

	didInsertElement: function () {
		Em.Logger.info('Injected ad:', this.get('name'));

		Mercury.Modules.Ads.getInstance().addSlot(this.get('name'));
	},

	willDestroyElement: function() {
		var name = this.get('name');

		Mercury.Modules.Ads.getInstance().removeSlot(this.get('name'));

		this.$().remove();

		Em.Logger.info('Will destroy ad:', name);
	}
});
