/// <reference path="../app.ts" />
'use strict';

App.LightboxMapComponent = Em.Component.extend({
	classNames: ['lightbox-map', 'lightbox-content-inner'],

	modelObserver: Em.observer('model', function (): void {
		var model = this.get('model');
		this.sendAction('setHeader', model.title);
		this.sendAction('setQueryParam', 'map', model.id);
	}).on('didInsertElement')
});
