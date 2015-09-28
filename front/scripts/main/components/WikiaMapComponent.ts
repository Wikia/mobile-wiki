/// <reference path="./ImageMediaComponent.ts" />
'use strict';

App.WikiaMapComponent = App.ImageMediaComponent.extend({
	classNames: ['wikia-map'],
	templateName: 'components/wikia-map',

	url: null,
	title: null,
	imageSrc: null,
	id: null,

	caption: Em.computed.alias('title'),

	didInsertElement() {
		//handle click with jquery because the 'normal' way to handle events doesn't work.
		this.$().click((): void => {
			var url = this.get('url'),
				id = this.get('id'),
				title = this.get('title');

			if (url) {
				Em.Logger.debug('Handling map with id:', id, 'and title:', title);

				M.track({
					action: M.trackActions.click,
					category: 'map'
				});

				this.sendAction('click', 'map', {
					title: title,
					url: url,
					id: id
				});
			}
		});
	}
});
