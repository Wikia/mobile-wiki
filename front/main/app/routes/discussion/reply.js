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
					// this is on purpose - we need to be specific about the model for this action
					// because otherwise it won't work after the transition
					this.modelFor('discussion.post').createReply(replyData);
				});
			},
		},
	}
);
