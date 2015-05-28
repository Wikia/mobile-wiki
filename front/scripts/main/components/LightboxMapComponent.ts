/// <reference path="../app.ts" />
'use strict';

App.LightboxMapComponent = Em.Component.extend({
	classNames: ['lightbox-map', 'lightbox-content-inner'],

	modelObserver: Em.observer('model', function (): void {
		this.set('header', this.get('model.title'));
	}).on('didInsertElement'),

	didInsertElement: function (): void {
		//this.set('header', this.get('model.title'));
	}

	//init: Em.observer('data.id', function (): void {
	//	this._super();
	//
	//	if (this.get('data.id')) {
	//		this.set('map', this.get('data.id'))
	//	}
	//}).on('init'),
	//
	///**
	// * sets all properties to their null state
	// */
	//reset: function (): void {
	//	this.setProperties({
	//		data: {},
	//		map: null
	//	});
	//
	//	this._super();
	//}
});
