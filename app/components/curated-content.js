import Component from '@ember/component';
import scrollToTop from '../utils/scroll-to-top';

export default Component.extend({
	classNames: ['curated-content', 'mw-content'],
	activeLabel: null,

	actions: {
		/**
		 * @param {CuratedContentItem} item
		 * @returns {void}
		 */
		openSection(item) {
			this.set('activeLabel', item.label);
			scrollToTop(this.element);
		},

		closeSection() {
			this.set('activeLabel', null);
		}
	}
});
