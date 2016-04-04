import Ember from 'ember';
import ViewportMixin from './viewport';

export default Ember.Mixin.create(ViewportMixin, {
	showLiknedElement() {
		const linkedElement = this.$('.is-highlighted');

		if (linkedElement.lenght === 0) {
			return;
		}

		window.scrollTo(0, linkedElement.offset().top - Ember.$('.headroom').outerHeight());
	},
});
