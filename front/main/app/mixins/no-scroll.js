import Ember from 'ember';

const {Mixin, observer, $} = Ember;

// singleton for no scroll state shared across all mixin usages
const NoScrollState = Ember.Object.extend().reopenClass({state: 0});

export default Mixin.create({
	// global state
	noScrollState: NoScrollState,
	// current component state
	noScroll: false,

	noScrollObserver: observer('noScroll', function () {
		const state = this.get('noScrollState.state');

		if (this.get('noScroll')) {
			this.set('noScrollState.state', state + 1);
		} else if (state > 0) {
			this.set('noScrollState.state', state - 1);
		}

		this.setNoScroll(Boolean(this.get('noScrollState.state')));
	}),

	setNoScroll(visible) {
		const $body = $('body');

		if (visible) {
			$body.addClass('no-scroll');
		} else {
			$body.removeClass('no-scroll');
		}
	}
});
