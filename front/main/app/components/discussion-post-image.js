import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

const {Component, String} = Ember;

export default Component.extend({
	attributeBindings: ['alt', 'height', 'src', 'style', 'width'],
	imageHeight: 0,
	imageWidth: 0,
	tagName: 'img',
	widthMultiplier: 1,

	/**
	 * @private
	 */
	didReceiveAttrs() {
		this._super(...arguments);
		// this.set('height', 500);
		// this.set('max-height', 200);
		// this.set('max-width', 200);
		// this.set('width', 500);
		// this.set('style', String.htmlSafe(`max-height: ${this.get('max-height')}px; max-width: ${this.get('max-width')}px;`));
		// const componentWidth = parseInt(this.$().parent().css('width'), 10),
		// 	componentHeight = componentWidth,
		// if (Math.min(imageWidth, componentWidth) === imageWidth) {
		//
		// } else {
		//
		// }

		// this.set('maxWidth', componentWidth);
		// this.set('maxHeight', componentHeight);
		// this.set('style', String.htmlSafe(`max-width: ${this.get('maxWidth')}px; max-height: ${this.get('maxHeight')}px;`));

		// console.info(this.get('width') + ' ' + this.$().css('width'));
	},

	didInsertElement() {
		this._super(...arguments);

		const imageHeight = this.get('imageHeight'),
			imageWidth = this.get('imageWidth'),
			maxImageHeight = imageWidth * this.get('widthMultiplier');

		if (imageHeight > maxImageHeight) {
			this.set('url', `${this.get('url')}/scale-to-height-down/${maxImageHeight}`);
		}

		this.set('src', this.get('url'));
	}
});
