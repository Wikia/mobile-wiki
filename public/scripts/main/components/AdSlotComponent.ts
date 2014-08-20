/// <reference path="../app.ts" />
'use strict';

App.AdSlotComponent = Em.Component.extend({
	layoutName: 'components/ad-slot',
	classNames: ['ad-slot-wrapper'],

	didInsertElement: function(){
		Wikia.ads.slots.push([this.get('name')]);
	}
});
