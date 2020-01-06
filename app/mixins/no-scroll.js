import Mixin from '@ember/object/mixin';
import EmberObject, { observer } from '@ember/object';

// singleton for no scroll state shared across all mixin usages
// eslint-disable-next-line ember/no-new-mixins
const NoScrollState = EmberObject.extend().reopenClass({ state: false });

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  // global state
  noScrollState: NoScrollState,
  // current component state
  noScroll: false,

  // eslint-disable-next-line ember/no-observers
  noScrollObserver: observer('noScroll', function () {
    this.setNoScroll(this.noScroll);
  }),

  init() {
    this._super(...arguments);
    // initialise with value
    this.setNoScroll(this.noScroll);
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
      document.body.classList.add('wds-no-scroll');
    } else {
      document.body.classList.remove('wds-no-scroll');
    }
  },
});
