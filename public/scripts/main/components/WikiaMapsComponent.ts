/// <reference path="../app.ts" />
/// <reference path="./ImageMediaComponent.ts" />
'use strict';

App.WikiaMapsComponent = App.ImageMediaComponent.extend({
	classNames: ['wikia-map'],

	clicked: 'openLightbox',

	url: null,
	title: null,
	imageSrc: null,
	id: null,

	actions: {
		lightboxOpening: function() {
			var url = this.get('url'),
				id = this.get('id'),
				title = this.get('title');
			if (url) {
				Em.Logger.debug('Handling map:', id, 'title:', title);
				this.sendAction('clicked', 'map-lightbox', {
					title: title,
					url: url,
					id: id
				}); 
			}
		},
	},

	didInsertElement: function () {
		//handle click with jquery because the 'normal' way to handle events doesn't work. 
		this.$().click(() => {
			this.send('lightboxOpening');
		});
	}
});
