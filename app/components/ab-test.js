import Component from '@ember/component';
import {getGroup} from '../modules/abtest';

export default Component.extend({
	didReceiveAttrs() {
		this._super(...arguments);
		const experiment = this.get('experiment'),
			usersGroup = getGroup(experiment);

		this.set('group', usersGroup);
	}
});
