import DiscussionModalDialogMixin from '../mixins/discussion-modal-dialog';

export default Ember.Component.extend(DiscussionModalDialogMixin,
	{
		discussionSort: Ember.inject.service(),

		canShowMore: Ember.computed('model.postCount', 'model.replies.length', function () {
			const model = this.get('model');

			return model.get('replies.length') < model.get('postCount');
		}),
	}
);




