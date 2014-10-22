/// <reference path="../app.ts" />
/// <reference path="../../baseline/mercury.d.ts" />
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

		Mercury.ads.slots.push([this.get('name')]);
	},

	willDestroyElement: function() {
		var name = this.get('name');

		Mercury.ads.slots = $.grep(Mercury.ads.slots, (slot) => {
			return slot[0] && slot[0] === name;
		}, true);

		this.$().remove();

		Em.Logger.info('Will destroy ad:', name);
		this.destroy();
	}
});
