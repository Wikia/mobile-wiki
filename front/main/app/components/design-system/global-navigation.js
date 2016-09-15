import Ember from 'ember';
import Headroom from '../../mixins/headroom';

export default Ember.Component.extend(Headroom, {
	classNames: ['wds-global-navigation-wrapper'],
	model: Ember.Object.create(M.prop('globalNavigation')),

	headroomPinnedObserver: Ember.observer('pinned', function () {
		this.get('triggerHeadroomStateChange')(this.get('pinned'));
	}),

	didInsertElement() {
		if (this.get('model.user')) {
			this.initHeadroom({}, this.$().outerHeight(true));
		}
	}
});
