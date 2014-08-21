/// <reference path="../app.ts" />
'use strict';

App.AdSlotComponent = Em.Component.extend({
	layoutName: 'components/ad-slot',
	classNames: ['ad-slot-wrapper'],
	classNameBindings: ['nameLowerCase'],

	nameLowerCase: function(){
		return this.get('name').toLowerCase().replace(/_/g, '-')
	}.property('name'),

	didInsertElement: function(){
		Em.Logger.info('Injected ad:', this.get('name'));

		Wikia.ads.slots.push([this.get('name')]);
	}
});
