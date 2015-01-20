/// <reference path="../app.ts" />
'use strict';

App.LoadingSpinnerComponent = Em.Component.extend({
	classNames: ['loading-overlay'],
	classNameBindings: ['hidden'],
	active: false,
	hidden: Em.computed.not('active')
});
