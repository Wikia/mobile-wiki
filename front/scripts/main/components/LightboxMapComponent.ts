/// <reference path="../app.ts" />
'use strict';

App.LightboxMapComponent = Em.Component.extend({
	classNames: ['lightbox-map', 'lightbox-content-inner'],

	modelObserver: Em.observer('model', function (): void {
		this.sendAction('setHeader', this.get('model.title'));
		this.setProperties({
			queryParamMap: this.get('model.id')
		});
	}).on('didInsertElement')
});
