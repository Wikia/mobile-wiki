import Ember from 'ember';

const {Mixin, observer, $} = Ember;

// singleton for no scroll state shared across all mixin usages
const NoScrollState = Ember.Object.extend().reopenClass({state: false});

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

		if (this.get('noScrollState.state') && current) {
			throw Error('No-scroll already applied, turn it off first');
		}
		this.set('noScrollState.state', current);

		if (current) {
			$body.addClass('no-scroll');
		} else {
			$body.removeClass('no-scroll');
		}
	}
});
