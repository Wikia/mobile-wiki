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
		this.setNoScroll(this.get('noScroll'));
	}),

	init() {
		this._super(...arguments);
		// initialise with value
		this.setNoScroll(this.get('noScroll'));
	},

	willDestroyElement() {
		this._super(...arguments);
		// turn off scroll on destroy
		this.setNoScroll(false);
	},

	setNoScroll(current) {
		const $body = $('body');
		let state = this.get('noScrollState.state');
		// decrease only if more then 0
		state = current ? state + 1 : (state > 0 ? state - 1 : 0);
		this.set('noScrollState.state', state);

		if (state > 0) {
			$body.addClass('no-scroll');
		} else {
			$body.removeClass('no-scroll');
		}
	}
});
