import DiscussionBaseRoute from './base';

export default DiscussionBaseRoute.extend({
	setupController: function(controller, error) {
		const discussionModel = this.modelFor('discussion');

		this._super(...arguments);
		error.index = discussionModel;
	}
});
