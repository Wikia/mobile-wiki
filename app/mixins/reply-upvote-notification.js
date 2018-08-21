import Mixin from '@ember/object/mixin';

export default Mixin.create({
	/**
	 * Constructs a localized reply upvote notification body
	 * @param {Ember.Object} model
	 * @returns {string}
	 */
	getReplyUpvoteMessageBody(model) {
		const hasTitle = model.get('title');
		const totalUniqueActors = model.get('totalUniqueActors');
		const hasMultipleUsers = totalUniqueActors > 1;

		if (hasTitle) {
			if (hasMultipleUsers) {
				return this.getTranslatedMessage('notifications-reply-upvote-multiple-users-with-title', {
					postTitle: this.postTitleMarkup,
					number: totalUniqueActors - 1
				});
			} else {
				return this.getTranslatedMessage('notifications-reply-upvote-single-user-with-title', {
					postTitle: this.postTitleMarkup,
				});
			}
		} else if (hasMultipleUsers) {
			return this.getTranslatedMessage('notifications-reply-upvote-multiple-users-no-title', {
				number: totalUniqueActors
			});
		} else {
			return this.getTranslatedMessage('notifications-reply-upvote-single-user-no-title');
		}
	},
});
