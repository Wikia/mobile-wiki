import Ember from 'ember';
import localStorageConnector from '../utils/local-storage-connector';

export default Ember.Mixin.create(
	{
		introducingFollowingSeenId: 'discussionIntroducingFollowingSeen',

		introducingFollowingWasNotSeen: Ember.computed('introducingFollowingSeenId', function () {
			return !Boolean(localStorageConnector.getItem(this.get('introducingFollowingSeenId')));
		}),

	}
);
