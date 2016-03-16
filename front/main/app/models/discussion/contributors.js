import Ember from 'ember';
import DiscussionContributor from 'contributor';

const DiscussionContributors = Ember.object.extend({
	count: null,
	users: [],

	getNormalizedData(data){
		this.set('count', data.count);

		data.userInfo.forEach((contributor) => {
			this.users.push(
				DiscussionContributor.getNormalizedData(contributor)
			);
		});

		return this;

	},
});

export default DiscussionContributors;
