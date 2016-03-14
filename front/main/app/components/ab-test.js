import Ember from 'ember';
import {getAbTestGroup} from 'common/utils/track';

export default Ember.Component.extend({
	didReceiveAttrs() {
		this._super(...arguments);
		const experiment = this.get('experiment'),
			usersGroup = getAbTestGroup(experiment);

		this.set('group', usersGroup);
	}
});
