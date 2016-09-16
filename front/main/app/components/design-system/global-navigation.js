import Ember from 'ember';
import Headroom from '../../mixins/headroom';

const {Component, Object, computed} = Ember;

export default Component.extend(Headroom, {
	activeDropdownCount: 0,
	classNames: ['wds-global-navigation-wrapper'],
	headroomEnabled: computed.bool('model.user'),
	model: Object.create(M.prop('globalNavigation')),
	searchIsActive: false,
	shouldHide: computed.not('activeDropdownCount'),

	didInsertElement() {
		this.initHeadroom({}, this.$().outerHeight(true));
	},

	actions: {
		onDropdownClose() {
			this.decrementProperty('activeDropdownCount');
		},

		onDropdownOpen() {
			this.incrementProperty('activeDropdownCount');
		},

		onHeadroomPin() {
			if (this.get('shouldHide')) {
				this.get('triggerHeadroomStateChange')(true);
			}
		},

		onHeadroomUnpin() {
			if (this.get('shouldHide')) {
				this.get('triggerHeadroomStateChange')(false);
			} else {
				const headroom = this.get('headroom');

				this.$(headroom.elem).addClass(headroom.classes.pinned).removeClass(headroom.classes.unpinned);
			}
		},

		activateSearch() {
			this.set('searchIsActive', true);
			this.incrementProperty('activeDropdownCount');
		},

		deactivateSearch() {
			this.set('searchIsActive', false);
			this.decrementProperty('activeDropdownCount');
		}
	}
});
