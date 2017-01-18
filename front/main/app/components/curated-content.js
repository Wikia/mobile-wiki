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
			const navHeight = Ember.$('.site-head').outerHeight() + Ember.$('.site-head-fandom-bar').outerHeight(),
				scrollTop = this.$().offset().top - navHeight;

			this.set('activeLabel', item.label);
			$('html, body').animate({scrollTop});
		},

		closeSection() {
			this.set('activeLabel', null);
		}
	}
});
