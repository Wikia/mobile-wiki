import Ember from 'ember';
import GalleryMediaComponent from './gallery-media';

export default GalleryMediaComponent.extend({
	tagName: 'div',
	classNames: ['linked-gallery'],
	layoutName: 'components/linked-gallery-media',

	limit: 4,
	// This is set the same as the limit property to prevent "empty" images
	// from showing before "View more" button is clicked
	incrementLimitValue: 4,

	canShowMore: Ember.computed('media', 'limit', function () {
		return this.get('media').length > this.get('limit');
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		showMore() {
			const previousLimit = this.get('limit'),
				mediaLength = this.get('media').length;

			this.set('limit', mediaLength);
			this.loadImages(previousLimit, (previousLimit + mediaLength));
			this.$('button').remove();
		},
	},

	/**
	 * @returns {void}
	 */
	setUp() {
		this._super();
		this.set('media', this.get('media').sort(this.sortMedia));
	},

	/**
	 * Sorts media by a simple criterion: if it's linked or not; use this method as compression function
	 *
	 * @param {ArticleMedia} a
	 * @param {ArticleMedia} b
	 * @returns {number}
	 */
	sortMedia(a, b) {
		if (a.link && typeof b.link === 'undefined') {
			return 1;
		} else if (b.link && typeof a.link === 'undefined') {
			return -1;
		}

		return 0;
	},

	/**
	 * @returns {void}
	 */
	load() {
		this.setUp();
		this.loadImages(0, this.limit);
		this.$().on('scroll', () => this.onScroll);
	},
});
