import Ember from 'ember';
import Headroom from '../../mixins/headroom';

export default Ember.Component.extend(Headroom, {
	classNames: ['wds-global-navigation-wrapper'],
	headroomEnabled: Ember.computed.bool('model.user'),
	model: Ember.Object.create(M.prop('globalNavigation')),
	shouldHide: true,

	headroomPinnedObserver: Ember.observer('pinned', function () {
		const pinned = this.get('pinned');

		if (!pinned && !this.get('shouldHide')) {
			const headroom = this.get('headroom');

			this.$(headroom.elem).addClass(headroom.classes.pinned).removeClass(headroom.classes.unpinned);
			this.set('pinned', true);
		} else {
			this.get('triggerHeadroomStateChange')(pinned);
		}

	}),

	didInsertElement() {
		this.initHeadroom({}, this.$().outerHeight(true));
	},

	actions: {
		dropdownOpened() {
			console.log('open');
			this.set('shouldHide', false);
		},

		dropdownClosed() {
			console.log('hide');
			this.set('shouldHide', true);
		},
	}
});
