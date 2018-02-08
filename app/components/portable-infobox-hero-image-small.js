import {computed} from '@ember/object';
import Component from '@ember/component';
import {htmlSafe} from '@ember/string';
import HeroImage from '../modules/hero-image';
import ImageLoader from '../mixins/image-loader';

export default Component.extend(
	ImageLoader,
	{
		maxWidth: computed(function () {
			return 410 * 0.7;
		}),

		heroImageHelper: computed('heroImage', 'maxWidth', function () {
			const heroImage = this.get('heroImage'),
				maxWidth = this.get('maxWidth');

			return new HeroImage(heroImage, maxWidth);
		}),

		imageSrc: computed(function () {
			return this.get('heroImageHelper.thumbnailUrl');
		}),

		linkStyle: computed('heroImageHelper', function () {
			const percent = this.get('heroImageHelper.computedHeight') / this.get('maxWidth') * 100;
			return htmlSafe(`padding-top: ${percent}%`);
		}),

		init() {
			this._super(...arguments);
		}
	}
);
