import {observer} from '@ember/object';
import {on} from '@ember/object/evented';
import Mixin from '@ember/object/mixin';
import Headroom from 'headroom';

export default Mixin.create({
	headroom: null,
	headroomEnabled: true,

	didInsertElement() {
		this._super(...arguments);

		this.initHeadroom(this.get('headroomOptions'), this.get('offset'));
	},

	didUpdateAttrs() {
		this._super(...arguments);

		this.initHeadroom(this.get('headroomOptions'), this.get('offset'));
	},

	/**
	 * @param {*} headroomOptions
	 * @param {number} offset
	 * @returns {void}
	 */
	initHeadroom(headroomOptions, offset) {
		if (this.get('headroomEnabled') === false) {
			return;
		}

		let headroom = this.get('headroom');

		if (headroom) {
			headroom.destroy();
		}

		let options = {
			classes: {
				initial: 'headroom',
				pinned: 'pinned',
				unpinned: 'un-pinned',
				top: 'headroom-top',
				notTop: 'headroom-not-top'
			},
			offset,
			onPin: () => {
				if (!this.get('isDestroyed')) {
					this.set('pinned', true);
				}
			},
			onUnpin: () => {
				if (!this.get('isDestroyed')) {
					this.set('pinned', false);
				}
			}
		};

		if (headroomOptions) {
			options = Object.assign({}, options, headroomOptions);
		}

		headroom = new Headroom(this.element, options);

		headroom.init();

		this.set('headroom', headroom);
	}
});
