import Ember from 'ember';

export default Ember.Mixin.create({
	heroImage: Ember.computed('model.media', function () {
		const media = this.get('model.media.media');

		if (Ember.isArray(media)) {
			for (let i = 0; i < media.length; i++) {
				if (media[i] && media[i].context === 'infobox-hero-image') {
					return media[i];
				}
			}
		}

		return null;
	})
});
