import { inject as service } from '@ember/service';
import { readOnly } from '@ember/object/computed';
import { computed } from '@ember/object';
import Component from '@ember/component';
import { htmlSafe } from '@ember/string';
import ImageLoader from '../mixins/image-loader';

export default Component.extend(
	ImageLoader,
	{
		lightbox: service(),

		classNames: ['pi', 'pi-hero-small-wrapper'],

		click() {
			this.lightbox.open('media', this.heroImage);

			return false;
		},
	}
);
