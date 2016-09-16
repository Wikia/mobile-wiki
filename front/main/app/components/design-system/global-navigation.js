import Ember from 'ember';
import Headroom from '../../mixins/headroom';

export default Ember.Component.extend(Headroom, {
	activeDropdownCount: 0,
	classNames: ['wds-global-navigation-wrapper'],
	headroomEnabled: Ember.computed.bool('model.user'),
	model: Ember.Object.create(M.prop('globalNavigation')),
	searchIsActive: false,
	shouldHide: Ember.computed.not('activeDropdownCount'),

	didInsertElement() {
		this.initHeadroom({}, this.$().outerHeight(true));
	},

	actions: {
		onDropdownChangeState(isActiveState) {
			if (isActiveState) {
				this.incrementProperty('activeDropdownCount');
			} else {
				this.decrementProperty('activeDropdownCount');
			}
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
