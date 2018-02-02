import Mixin from '@ember/object/mixin';
import EmberObject, {observer} from '@ember/object';

// singleton for no scroll state shared across all mixin usages
const NoScrollState = EmberObject.extend().reopenClass({state: false});

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
		if (!window.location) {
			return;
		}

		if (this.get('noScrollState.state') && current) {
			throw Error('No-scroll already applied, turn it off first');
		}
		this.set('noScrollState.state', current);

		if (current) {
			document.body.classList.add('no-scroll');
		} else {
			document.body.classList.remove('no-scroll');
		}
	}
});
