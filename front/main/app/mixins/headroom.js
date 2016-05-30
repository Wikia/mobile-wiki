import Ember from 'ember';

export default Ember.Mixin.create({
	headroom: null,
	headroomEnabled: true,

	/**
	 * Observes smartBannerVisible property which is controlled by SmartBannerComponent
	 * and goes through ApplicationController. Reinitializes Headroom when it changes.
	 *
	 * We're cacheing values, because we want to re-initialize Headroom only when those are changed
	 * and only once - without cache'ing smartBannerVisibleObserver is fiering for each component
	 * it's included in - at the time of writing this it's TWO TIMES
	 */

	cachedProperties: {
		smartBannerVisible: null,
		offset: null,
		headroomOptions: null
	},

	smartBannerVisibleObserver: Ember.on('willInsertElement',
		Ember.observer('smartBannerVisible', 'offset', 'headroomOptions', function () {
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
		})
	),

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
				}
			},
			onUnpin: () => {
				if (!this.get('isDestroyed')) {
					this.set('pinned', false);
				}
			}
		};

		if (headroomOptions) {
			options = $.extend({}, options, headroomOptions);
		}

		const headroom = new Headroom(this.get('element'), options);

		headroom.init();

		this.set('headroom', headroom);
	}
});
