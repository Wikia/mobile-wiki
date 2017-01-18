import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['curated-content', 'mw-content'],
	activeLabel: null,

	actions: {
		/**
		 * @param {CuratedContentItem} item
		 * @returns {void}
		 */
		openSection(item) {
			const navHeight = Ember.$('.site-head').outerHeight(),
				scrollTop = this.$().offset().top - navHeight;

			this.set('activeLabel', item.label);
			$('html, body').animate({scrollTop});
		},

		closeSection() {
			this.set('activeLabel', null);
		}
	}
});
