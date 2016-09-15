import Ember from 'ember';
import Headroom from '../../mixins/headroom';

export default Ember.Component.extend(Headroom, {
	classNames: ['wds-global-navigation-wrapper'],
	headroomEnabled: Ember.computed.bool('model.user'),
	model: Ember.Object.create(M.prop('globalNavigation')),

	headroomPinnedObserver: Ember.observer('pinned', function () {
		this.get('triggerHeadroomStateChange')(this.get('pinned'));
	}),

	didInsertElement() {
		this.initHeadroom({}, this.$().outerHeight(true));
	}
});
