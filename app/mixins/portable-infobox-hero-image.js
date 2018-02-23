import {isArray} from '@ember/array';
import {computed} from '@ember/object';
import Mixin from '@ember/object/mixin';

export default Mixin.create({
	heroImage: computed('model.media', function () {
		const media = this.get('model.media.media');

		if (isArray(media)) {
			for (let i = 0; i < media.length; i++) {
				if (media[i] && media[i].context === 'infobox-hero-image') {
					media[i].url = 'http://harrypotter.sandbox-dedicated.wikia.com/vignette/harrypotter/images/2/2e/' +
						'Locked_Out_of_the_House_Classics.png/revision/latest/top-crop/width/412/height/375?cb=20130302165514';
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
