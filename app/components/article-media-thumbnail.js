import { or, equal, lte, bool, not } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
	lightbox: service(),

	classNames: ['article-media-thumbnail'],
	classNameBindings: ['itemType', 'isLoading', 'downloadable'],
	tagName: 'figure',

	/**
	 * Default is `article`
	 * It can be overridden when rendering from another component, e.g. from article-media-gallery
	 */
	itemContext: 'article',

	hasFigcaption: or('model.caption', 'showTitle'),
	hasThumbnail: bool('model.thumbnailUrl'),

	isVideo: equal('model.type', 'video'),

	downloadable: not('hasThumbnail'),

	itemType: computed('itemContext', 'model.type', function () {
		return `${this.itemContext}-${this.get('model.type')}`;
	}),

	showTitle: computed('model', 'hasThumbnail', function () {
		return (this.get('model.type') === 'video' || !this.hasThumbnail) && this.get('model.title');
	}),

	didRender() {
		window.lazySizes.init();
	},

	click(event) {
		// Don't open lightbox when caption was clicked
		if (!event.target.closest('figcaption') && this.hasThumbnail) {
			this.lightbox.open('media', this.model);

			return false;
		}

		return undefined;
	},
});
