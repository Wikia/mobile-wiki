/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
/// <reference path="./ImageMediaComponent.ts" />
'use strict';

App.WikiaMapsComponent = App.ImageMediaComponent.extend({
	classNames: ['wikia-map'],
	classNameBindings: ['visible'],

	clicked: 'openLightbox',

	mapUrl: null,
	mapTitle: null,
	imageSrc: null,
	mapId: null,

	actions: {
		lightboxOpening: function() {
			console.log("mapUrl "+ this.get('mapUrl'));
			if (this.get('mapUrl')) {
				Em.Logger.debug('Handling map:', this.get('mapId'), 'title:', this.get('mapTitle'));
				this.sendAction('clicked', 'map-lightbox', {
					mapTitle: this.get('mapTitle'),
					mapUrl: this.get('mapUrl')
				}); 
			}
		}
	},

	didInsertElement: function () {
		this.$().click(() => {
			console.log("diana wikia maps component click");
			this.send('lightboxOpening');
		})
	}
});
