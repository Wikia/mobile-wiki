import {computed} from '@ember/object';
import {oneWay} from '@ember/object/computed';
import Component from '@ember/component';
import ViewportMixin from '../mixins/viewport';
import Thumbnailer from '../modules/thumbnailer';
import InViewportMixin from 'ember-in-viewport';

export default Component.extend(ViewportMixin, InViewportMixin, {
	tagName: 'a',
	classNames: ['trending-articles-item'],
	attributeBindings: ['href', 'style'],
	style: null,
	imageWidth: 250,
	shouldBeLoaded: false,

	href: oneWay('url'),

	currentlyRenderedImageUrl: computed('imageUrl', 'shouldBeLoaded', function () {
		if (this.get('imageUrl') && this.get('shouldBeLoaded')) {
			const options = {
				width: this.get('imageWidth'),
				height: this.get('imageHeight'),
				mode: Thumbnailer.mode.topCrop,
			};

			return Thumbnailer.getThumbURL(this.get('imageUrl'), options);
		} else {
			return this.getSvgPlaceholder();
		}
	}),

	imageHeight: computed('imageWidth', function () {
		return Math.floor(this.get('imageWidth') * 9 / 16);
	}),

	/**
	 * @returns {void}
	 */
	didEnterViewport() {
		debugger;
		this.set('shouldBeLoaded', true);
		// if (this.get('url')) {
		// 	this.set('isLoading', true);
		// }
	},

	/**
	 * Returns placeholder SVG (in form of DataURI).
	 *
	 * @returns {string}
	 */
	getSvgPlaceholder() {
		const width = this.get('imageWidth'),
			height = this.get('imageHeight');

		return `data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg' viewBox%3D'0 0 ${width} ${height}'%2F%3E`; // eslint-disable-line max-len
	},
});
