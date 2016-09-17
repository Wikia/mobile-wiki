import Ember from 'ember';
import Headroom from '../../mixins/headroom';

const {Component, Object: EmberObject, computed} = Ember;

export default Component.extend(Headroom, {
	classNames: ['wds-global-navigation-wrapper'],
	model: EmberObject.create(M.prop('globalNavigation')),
	activeDropdownCount: 0,
	headroomEnabled: computed.bool('model.user'),
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
				this.get('triggerGlobalNavigationHeadroomStateChange')(true);
			}
		},

		onHeadroomUnpin() {
			if (this.get('shouldHide')) {
				this.get('triggerGlobalNavigationHeadroomStateChange')(false);
			} else {
				const headroom = this.get('headroom');

				// While dropdowns are opened we don't want to hide global navigation, that is why we disable headroom
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
