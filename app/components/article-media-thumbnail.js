import {or, equal, lte} from '@ember/object/computed';
import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {computed} from '@ember/object';

export default Component.extend({
	lightbox: service(),

	classNames: ['article-media-thumbnail'],
	classNameBindings: ['itemType', 'isLoading', 'isOgg'],
	tagName: 'figure',

	/**
	 * Default is `article`
	 * It can be overridden when rendering from another component, e.g. from article-media-gallery
	 */
	itemContext: 'article',

	hasFigcaption: or('model.caption', 'showTitle'),
	isVideo: equal('model.type', 'video'),

	isOgg: equal('model.mime', 'application/ogg'),

	itemType: computed('itemContext', 'model.type', function () {
		return `${this.get('itemContext')}-${this.get('model.type')}`;
	}),

	showTitle: computed('model.type', function () {
		return (this.get('model.type') === 'video' || this.get('model.isOgg')) && this.get('model.title');
	}),

	didRender() {
		window.lazySizes.init();
	},

	click(event) {
		// Don't open lightbox when image is linked by user or caption was clicked
		if (!this.get('model.isLinkedByUser') && !event.target.closest('figcaption') && !this.get('isOgg')) {
			this.get('lightbox').open('media', this.get('model'));

			return false;
		}
	},
});
