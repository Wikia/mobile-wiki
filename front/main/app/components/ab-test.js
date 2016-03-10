import Ember from 'ember';
import {getGroup} from 'common/modules/AbTest';

export default Ember.Component.extend({
	didReceiveAttrs() {
		this._super(...arguments);
		const experiment = this.get('experiment'),
			usersGroup = getGroup(experiment);

		this.set('group', usersGroup);
	}
});
