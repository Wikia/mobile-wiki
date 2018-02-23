import {isArray} from '@ember/array';
import {computed} from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
	heroImage: computed('model.media', function () {
		const media = this.get('model.media.media');

		if (isArray(media)) {
			for (let i = 0; i < media.length; i++) {
				if (media[i] && media[i].context === 'infobox-hero-image') {
					media[i].url = 'http://project43.sandbox-content.wikia.com/vignette/starter/images/a/a9/Example.jpg/' +
						'revision/latest/fixed-aspect-ratio/width/412/height';
					return media[i];
				}
			}
		}

		return null;
	}),

	heroImageInHeader: computed('heroImage', 'model.featuredVideo', function () {
		return !this.get('model.featuredVideo') ? this.get('heroImage') : null;
	}),
});
