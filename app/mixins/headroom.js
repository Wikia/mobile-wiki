import Mixin from '@ember/object/mixin';
import Headroom from 'headroom';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  headroom: null,
  headroomEnabled: true,

  didInsertElement() {
    this._super(...arguments);

    this.initHeadroom(this.headroomOptions, this.offset);
  },

  didUpdateAttrs() {
    this._super(...arguments);

    this.initHeadroom(this.headroomOptions, this.offset);
  },

  /**
  * @param {*} headroomOptions
  * @param {number} offset
  * @returns {void}
  */
  initHeadroom(headroomOptions, offset) {
    if (this.headroomEnabled === false) {
      return;
    }

    let headroom = this.headroom;

    if (headroom) {
      headroom.destroy();
    }

    let options = {
      classes: {
        initial: 'headroom',
        pinned: 'pinned',
        unpinned: 'un-pinned',
        top: 'headroom-top',
        notTop: 'headroom-not-top',
      },
      offset,
      onPin: () => {
        if (!this.isDestroyed) {
          this.set('pinned', true);
        }
      },
      onUnpin: () => {
        if (!this.isDestroyed) {
          this.set('pinned', false);
        }
      },
    };

    if (headroomOptions) {
      options = Object.assign({}, options, headroomOptions);
    }

    headroom = new Headroom(this.element, options);

    headroom.init();

    this.set('headroom', headroom);
  },
});
