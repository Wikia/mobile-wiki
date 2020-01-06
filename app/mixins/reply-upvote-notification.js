import Mixin from '@ember/object/mixin';

// eslint-disable-next-line ember/no-new-mixins
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
          number: totalUniqueActors - 1,
        });
      }
      return this.getTranslatedMessage('notifications-reply-upvote-single-user-with-title', {
        postTitle: this.postTitleMarkup,
      });
    }
    if (hasMultipleUsers) {
      return this.getTranslatedMessage('notifications-reply-upvote-multiple-users-no-title', {
        number: totalUniqueActors,
      });
    }
    return this.getTranslatedMessage('notifications-reply-upvote-single-user-no-title');
  },
});
