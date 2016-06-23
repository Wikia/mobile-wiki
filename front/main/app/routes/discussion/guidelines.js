import Ember from 'ember';
import DiscussionBaseRoute from './base';

export default DiscussionBaseRoute.extend({
	model(params) {
		const indexModel = this.modelFor('discussion');

		return Ember.RSVP.hash({
			attributes: indexModel.attributes,
		});
	},
});
