import Ember from 'ember';
import {getGroup} from '../modules/abtest';

export default Ember.Component.extend({
	didReceiveAttrs() {
		this._super(...arguments);
		const experiment = this.get('experiment'),
			usersGroup = getGroup(experiment);

		this.set('group', usersGroup);
	}
});
