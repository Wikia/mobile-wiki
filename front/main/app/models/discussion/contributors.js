import Ember from 'ember';
import DiscussionContributor from 'contributor';

const DiscussionContributors = Ember.object.extend({
	count: null,
	contributors: [],

	getNormalizedData(data){
		this.set('count', data.count);

		data.userInfo.forEach((contributor) => {
			this.contributors.push(
				DiscussionContributor.getNormalizedData(contributor)
			);
		});

		return this;

	},
});

export default DiscussionContributors;
