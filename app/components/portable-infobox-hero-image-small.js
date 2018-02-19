import {readOnly} from '@ember/object/computed';
import {computed} from '@ember/object';
import Component from '@ember/component';
import {htmlSafe} from '@ember/string';
import HeroImage, {MAX_WIDTH} from '../modules/hero-image';
import ImageLoader from '../mixins/image-loader';
import Thumbnailer from '../modules/thumbnailer';

export default Component.extend(
	ImageLoader,
	{
		classNames: ['pi'],

		imageSrc: readOnly('heroImageHelper.thumbnailUrl'),

		maxWidth: Math.floor(MAX_WIDTH * 0.7),

		heroImageHelper: computed('heroImage', 'maxWidth', function () {
			const heroImage = this.get('heroImage'),
				maxWidth = this.get('maxWidth');

			return new HeroImage(heroImage, Thumbnailer.mode.topCropDown, maxWidth);
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
