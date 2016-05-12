import Ember from 'ember';
export default Ember.Controller.extend({
	application: Ember.inject.controller(),

	heroImage: Ember.computed('model.media', function () {
		let heroImage;

		this.get('model.media.media').forEach((current) => {
			if (current.hasOwnProperty('context') && current.context === 'infobox-hero-image') {
				heroImage = current;
			}
		});

		return heroImage;
	})
});
