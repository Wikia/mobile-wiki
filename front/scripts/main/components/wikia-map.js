import Ember from 'ember';
import ImageMediaComponent from 'image-media.js';

const WikiaMapComponent = ImageMediaComponent.extend({
	classNames: ['wikia-map'],
	caption: Ember.computed.alias('title'),

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		// handle click with jquery because the 'normal' way to handle events doesn't work.
		this.$().click(() => {
			const url = this.get('url'),
				id = this.get('id'),
				title = this.get('title');

			if (url) {
				Ember.Logger.debug('Handling map with id:', id, 'and title:', title);

				M.track({
					action: M.trackActions.click,
					category: 'map',
				});

				this.sendAction('click', 'map', {
					id,
					title,
					url,
				});
			}
		});
	},
});

export default WikiaMapComponent;
