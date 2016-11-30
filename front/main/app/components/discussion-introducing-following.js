import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';

export default Ember.Component.extend(
	{
		init() {
			this._super(...arguments);
			localStorageConnector.setItem(this.get('introducingFollowingSeenId'), true);
		},
	}
);
