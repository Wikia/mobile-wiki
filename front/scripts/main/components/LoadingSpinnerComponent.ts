/// <reference path="../app.ts" />
'use strict';

App.LoadingSpinnerComponent = Em.Component.extend({
	classNameBindings: ['overlay:loading-overlay'],
	isVisible: Em.computed.alias('active'),

	active: false,
	overlay: true
});
