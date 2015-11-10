import Ember from 'ember';
import DiscussionIndexModel from '../models/discussion-index';

const DiscussionIndexRoute = Ember.Route.extend({
	/**
	 * @returns {void}
	 */
	beforeModel() {
		const controller = this.controllerFor('discussionForum');

		this.transitionTo('discussion.forum', Mercury.wiki.id, controller.get('sortTypes')[0].name);
	},

	/**
	 * @returns {*}
	 */
	model() {
		return DiscussionIndexModel.find(Mercury.wiki.id);
	}
});

export default DiscussionIndexRoute;
