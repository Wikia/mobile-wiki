/// <reference path="../app.ts" />
'use strict';

App.LightboxMapComponent = Em.Component.extend({
	classNames: ['lightbox-map', 'lightbox-content-inner'],

	modelObserver: Em.observer('model', function (): void {
		this.updateState();
	}),

	didInsertElement(): void {
		// this.updateState modifies header and footer rendered in LightboxWrapperComponent
		// This isn't allowed by Ember to do on didInsertElement
		// That's why we need to schedule it in the afterRender queue
		Em.run.scheduleOnce('afterRender', this, (): void => {
			this.updateState();
		});
	},

	updateState(): void {
		var model = this.get('model');
		this.sendAction('setHeader', model.title);
		this.sendAction('setQueryParam', 'map', model.id);
	},
});
