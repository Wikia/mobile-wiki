import Component from '@ember/component';
import offset from '../utils/offset';

export default Component.extend({
	classNames: ['curated-content', 'mw-content'],
	activeLabel: null,

	actions: {
		/**
		 * @param {CuratedContentItem} item
		 * @returns {void}
		 */
		openSection(item) {
			const siteHeadContainer = document.querySelector('.site-head-container'),
				navHeight = siteHeadContainer ? siteHeadContainer.offsetHeight : 0,
				scrollTop = offset(this.element).top - navHeight;

			this.set('activeLabel', item.label);
			window.scroll({
				top: scrollTop,
				behavior: 'smooth'
			});
		},

		closeSection() {
			this.set('activeLabel', null);
		}
	}
});
