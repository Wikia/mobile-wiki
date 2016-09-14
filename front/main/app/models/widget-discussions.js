import Ember from 'ember';
import DiscussionContributionModelMixin from '../mixins/discussion-contribution-model';

export default Ember.Object.extend(
	DiscussionContributionModelMixin,
	{
		upvotingInProgress: {},
	}
);
