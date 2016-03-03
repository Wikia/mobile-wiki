import Ember from 'ember';
import AbTest from 'common/modules/AbTest';

export default Ember.Component.extend({
	didReceiveAttrs() {
		this._super(...arguments);
		const experiment = this.get('experiment'),
			usersGroup = AbTest.getGroup(experiment);

		this.set('group', usersGroup);
	}
});
