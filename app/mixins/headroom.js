import {observer} from '@ember/object';
import {on} from '@ember/object/evented';
import Mixin from '@ember/object/mixin';
import Headroom from 'headroom';

export default Mixin.create({
	headroom: null,
	headroomEnabled: true,

	cachedProperties: {
		smartBannerVisible: null,
		offset: null,
		headroomOptions: null
	},

	/**
	 * Observes smartBannerVisible property which is controlled by SmartBannerComponent
	 * and goes through ApplicationController. Reinitializes Headroom when it changes.
	 *
	 * We're cacheing values, because we want to re-initialize Headroom only when those are changed
	 * and only once - without cache'ing smartBannerVisibleObserver is fiering for each component
	 * it's included in - at the time of writing this it's TWO TIMES
	 */
	smartBannerVisibleObserver: on('willInsertElement',
		observer('smartBannerVisible', 'offset', 'headroomOptions', function () {
			const headroom = this.get('headroom'),
				smartBannerVisible = this.get('smartBannerVisible'),
				offset = this.get('offset'),
				headroomOptions = this.get('headroomOptions'),
				cachedProperties = this.get('cachedProperties');

			if (smartBannerVisible !== cachedProperties.smartBannerVisible ||
				headroomOptions !== cachedProperties.headroomOptions ||
				offset !== cachedProperties.offset) {

				this.set('cachedProperties', {
					smartBannerVisible,
					offset,
					headroomOptions,
				});

				if (headroom) {
					headroom.destroy();
				}

				this.initHeadroom(headroomOptions, offset);
			}
		})),

	actions: {
		onHeadroomPin() {},
		onHeadroomUnpin() {}
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
					this.send('onHeadroomPin');
				}
			},
			onUnpin: () => {
				if (!this.get('isDestroyed')) {
					this.set('pinned', false);
					this.send('onHeadroomUnpin');
				}
			}
		};

		if (headroomOptions) {
			options = Object.assign({}, options, headroomOptions);
		}

		const headroom = new Headroom(this.get('element'), options);

		headroom.init();

		this.set('headroom', headroom);
	}
});
