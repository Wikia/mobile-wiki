import DiscussionBaseRoute from './base';

export default DiscussionBaseRoute.extend({
	setupController(controller, error) {
		const discussionModel = this.modelFor('discussion');

		this._super(...arguments);
		error.set('index', discussionModel);
	}
});
