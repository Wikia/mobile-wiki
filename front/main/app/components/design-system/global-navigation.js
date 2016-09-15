import Ember from 'ember';
import Headroom from '../../mixins/headroom';

export default Ember.Component.extend(Headroom, {
	classNames: ['wds-global-navigation-wrapper'],
	model: Ember.Object.create(M.prop('globalNavigation')),

	didInsertElement() {
		if (this.get('model.user')) {
			this.initHeadroom({}, this.$().outerHeight(true));
		}
	}
});
