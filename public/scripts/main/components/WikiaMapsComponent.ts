/// <reference path="./ImageMediaComponent.ts" />
'use strict';

App.WikiaMapsComponent = App.ImageMediaComponent.extend({
	classNames: ['wikia-map'],

	url: null,
	title: null,
	imageSrc: null,
	id: null,
	height: 200,

	caption: Em.computed.alias('title'),

	didInsertElement: function () {
		//handle click with jquery because the 'normal' way to handle events doesn't work. 
		this.$().click(() => {
			var url = this.get('url'),
				id = this.get('id'),
				title = this.get('title');

			if (url) {
				Em.Logger.debug('Handling map:', id, 'title:', title);

				M.track({
					action: M.trackActions.click,
					category: 'map'
				});

				this.sendAction('click', 'map-lightbox', {
					title: title,
					url: url,
					id: id
				});
			}
		});
	}
});
