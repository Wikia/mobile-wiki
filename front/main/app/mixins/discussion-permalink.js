import Ember from 'ember';

export default Ember.Mixin.create({
	showLikedElement() {
		const linkedElement = this.$('.is-highlighted');

		if (linkedElement.lenght === 0) {
			return;
		}

		window.scrollTo(0, linkedElement.offset().top - Ember.$('.headroom').outerHeight());
	},

	didInsertElement() {
		this.showLikedElement();
	},
});
