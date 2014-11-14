/// <reference path="../app.ts" />
/// <reference path="./ImageMediaComponent.ts" />
'use strict';

App.WikiaMapsComponent = App.ImageMediaComponent.extend({
	classNames: ['wikia-map'],

	clicked: 'openLightbox',

	mapUrl: null,
	mapTitle: null,
	mapId: null,

	actions: {
		lightboxOpening: function() {
			if (this.get('mapUrl')) {
				Em.Logger.debug('Handling map:', this.get('mapId'), 'title:', this.get('mapTitle'));
				this.sendAction('clicked', 'map-lightbox', {
					mapTitle: this.get('mapTitle'),
					mapUrl: this.get('mapUrl'),
					mapId: this.get('mapId')
				}); 
			}
		},
	},

	didInsertElement: function () {
		//handle click with jquery because the 'normal' way to handle events doesn't work. 
		this.$().click(() => {
			this.send('lightboxOpening');
		})
	}
});
