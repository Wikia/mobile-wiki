import Mixin from '@ember/object/mixin';

// eslint-disable-next-line ember/no-new-mixins
export default Mixin.create({
  /**
  * Constructs a localized reply notification body
  * @param {Ember.Object} model
  * @returns {string}
  */
  getReplyMessageBody(model) {
    const hasTitle = model.get('title');
    const totalUniqueActors = model.get('totalUniqueActors');
    const hasTwoUsers = totalUniqueActors === 2;
    const hasThreeOrMoreUsers = totalUniqueActors > 2;
    const firstReplierName = model.get('latestActors.0.name');

    if (hasTitle) {
      if (hasThreeOrMoreUsers) {
        return this.getTranslatedMessage('notifications-replied-by-multiple-users-with-title', {
          postTitle: this.postTitleMarkup,
          mostRecentUser: firstReplierName,
          number: totalUniqueActors - 1,
        });
      }
      if (hasTwoUsers) {
        return this.getTranslatedMessage('notifications-replied-by-two-users-with-title', {
          firstUser: firstReplierName,
          secondUser: model.get('latestActors.1.name'),
          postTitle: this.postTitleMarkup,
        });
      }
      return this.getTranslatedMessage('notifications-replied-by-with-title', {
        user: firstReplierName,
        postTitle: this.postTitleMarkup,
      });
    }
    if (hasThreeOrMoreUsers) {
      return this.getTranslatedMessage('notifications-replied-by-multiple-users-no-title', {
        username: this.usernameMarkup,
        mostRecentUser: firstReplierName,
        number: totalUniqueActors - 1,
      });
    }
    if (hasTwoUsers) {
      return this.getTranslatedMessage('notifications-replied-by-two-users-no-title', {
        firstUser: firstReplierName,
        secondUser: model.get('latestActors.1.name'),
      });
    }
    return this.getTranslatedMessage('notifications-replied-by-no-title', {
      user: firstReplierName,
    });
  },
});
