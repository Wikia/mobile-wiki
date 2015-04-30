/// <reference path="../app.ts" />
'use strict';

App.LoadingSpinnerComponent = Em.Component.extend({
	classNameBindings: ['overlay:loading-overlay', 'hidden'],
	active: false,
	overlay: true,
	hidden: Em.computed.not('active')
});
