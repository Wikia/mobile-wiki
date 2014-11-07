/// <reference path="../app.ts" />
/// <reference path="./MediaComponent.ts" />
/// <reference path="./ImageMediaComponent.ts" />
'use strict';

App.WikiaMapsComponent = App.ImageMediaComponent.extend({
	classNames: ['wikia-map'],
	classNameBindings: ['visible'],

	mapUrl: null,
	caption: null,
	imageSrc: null,

	didInsertElement: function () {
		this.$().click(() => {
					console.log("diana wikia maps component click");
					//var mapId = $(target).children('.wikia-interactive-map-link').data('map-id');
					console.log("this classname "+this.className);
					console.log("mapUrl "+ this.get('mapUrl'));
					console.log("caption "+ this.get('caption'));
					console.log("src "+ this.get('src'));
					//if (mapId >= 0 ){
						//var mapTitle = $(target).children('.wikia-interactive-map-link').data('map-title');
						//var mapUrl = $(target).children('.wikia-interactive-map-link').data('map-url');
						//Em.Logger.debug('Handling map:', mapId, 'title:', mapTitle);
						//this.get('controller').send('openLightbox', 'map-lightbox', {
							//mapTitle: caption,
							//mapUrl: mapUrl
						//});
					//}
				})
	},

	//gestures: {
		click: function (event: Event): void {
			console.log("diana wikia maps component ");

			var $closest =  Em.$(event.target).closest('a'),
				target: EventTarget = $closest.length ? $closest[0] : event.target;

			//var mapId = $(target).children('.wikia-interactive-map-link').data('map-id');

			console.log("mapUrl"+ this.get('mapUrl'));

			//if (mapId >= 0 ){
				//var mapTitle = $(target).children('.wikia-interactive-map-link').data('map-title');
				//var mapUrl = $(target).children('.wikia-interactive-map-link').data('map-url');
				//Em.Logger.debug('Handling map:', mapId, 'title:', mapTitle);
				//this.get('controller').send('openLightbox', 'map-lightbox', {
					//mapTitle: caption,
					//mapUrl: mapUrl
				//});
			//}
		}
	//}
});
