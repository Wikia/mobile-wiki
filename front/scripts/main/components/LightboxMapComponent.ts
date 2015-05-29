/// <reference path="../app.ts" />
'use strict';

App.LightboxMapComponent = Em.Component.extend({
	classNames: ['lightbox-map', 'lightbox-content-inner'],

	modelObserver: Em.observer('model', function (): void {
		this.set('header', this.get('model.title'));
		this.set('queryParamMap', this.get('model.id'));
	}).on('didInsertElement')
});
