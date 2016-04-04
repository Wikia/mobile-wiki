import Ember from 'ember';

export default Ember.Mixin.create({
	showLikedElement() {
		const linkedElement = this.$('.is-highlighted');

		if (linkedElement.length === 0) {
			return;
		}

		window.scrollTo(0, linkedElement.offset().top - Ember.$('.site-body-discussion').offset().top);
	},

	didInsertElement() {
		this.showLikedElement();
	},
});
