import Component from '@ember/component';
import offset from '../utils/offset';
import $ from 'jquery';

export default Component.extend({
	classNames: ['curated-content', 'mw-content'],
	activeLabel: null,

	actions: {
		/**
		 * @param {CuratedContentItem} item
		 * @returns {void}
		 */
		openSection(item) {
			const navHeight = document.querySelector('.site-head-container').offsetHeight,
				scrollTop = offset(this.element).top - navHeight;

			this.set('activeLabel', item.label);
			$('html, body').animate({scrollTop});
		},

		closeSection() {
			this.set('activeLabel', null);
		}
	}
});
