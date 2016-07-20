import Ember from 'ember';
import DiscussionPostRoute from './post';

export default DiscussionPostRoute.extend(
	{
		discussionEditor: Ember.inject.service(),
		controllerName: 'discussion.post',
		templateName: 'discussion.post',

		actions: {
			/**
			 * Triggers new reply creation on a model
			 * @param {Object} replyData
			 * @returns {void}
			 */
			create(replyData) {
				const model = this.modelFor(this.get('routeName'));

				this.transitionTo('discussion.post', model.get('threadId')).promise.then(() => {
					// when not using a default model for a route,
					// it needs to be explicit about model name to call after a transition
					this.modelFor('discussion.post').current.createReply(replyData);
				});
			},
		},
	}
);
