/// <reference path="../app.ts" />
'use strict';

App.LoadingSpinnerComponent = Em.Component.extend({
	classNameBindings: ['overlay:loading-overlay'],
	isVisible: Em.computed.alias('active'),

	active: false,
	overlay: true,
	radius: 30,
	strokeWidth: 6,

	fullRadius: Em.computed('radius', function (): number {
		return this.get('radius') + (this.get('strokeWidth')/2);
	}),
	fullDiameter: Em.computed('radius', function (): number {
		return this.get('radius') * 2 + this.get('strokeWidth');
	})
});
