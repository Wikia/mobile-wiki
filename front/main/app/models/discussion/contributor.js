import Ember from 'ember';

const DiscussionContributor = Ember.object.extend({
	avatarUrl: null,
	id: null,
	name: null,

	getNormalizedData(data){
		this.setProperties({
			avatarUrl: data.avatarUrl,
			id: data.id,
			name: data.name,
		});

		return this;
	},
});

export default DiscussionContributor;
