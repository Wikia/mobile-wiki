import Ember from 'ember';

export default Ember.Mixin.create({
	showLinkedElement() {
		const highlightedElement = this.$('.is-highlighted');

		if (highlightedElement.length === 0) {
			return;
		}

		window.scrollTo(0, highlightedElement.offset().top - Ember.$('.site-body-discussion').offset().top);
	},

	didInsertElement() {
		this._super(...arguments);
		this.showLinkedElement();
	},
});
