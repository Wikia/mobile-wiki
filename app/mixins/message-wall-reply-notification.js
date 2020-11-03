import Mixin from '@ember/object/mixin';

export default Mixin.create({
  /**
  * Constructs a localized reply notification body
  * @param {Ember.Object} model
  * @returns {string}
  */
  getMessageWallReplyBody(model) {
    const totalUniqueActors = model.get('totalUniqueActors');
    const hasTwoOrMoreUsers = totalUniqueActors > 1;
    const firstReplierName = model.get('latestActors.0.name');

    // need this check 
    const isOwnWall = firstReplierName === '// check model.uri for name in Message Wall uri';


    if (hasTwoOrMoreUsers) {
        if (isOwnWall) {
            return this.getTranslatedMessage('notifications-own-wall-reply-multiple-users', {
                user: firstReplierName,
                number: totalUniqueActors - 1,
                postTitle: this.postTitleMarkup,
            });
        } else {
            return this.getTranslatedMessage('notifications-wall-reply-multiple-users', {
                firstUser: firstReplierName,
                secondUser: model.get('latestActors.1.name'),
                number: totalUniqueActors - 1,
                postTitle: this.postTitleMarkup,
            });
        }
    }

    if (isOwnWall) {
        return this.getTranslatedMessage('notifications-own-wall-reply', {
            user: firstReplierName,
            postTitle: this.postTitleMarkup,
        });
    }

    return this.getTranslatedMessage('notifications-wall-reply', {
        firstUser: firstReplierName,
        secondUser: model.get('latestActors.1.name'),
        postTitle: this.postTitleMarkup,
    })
  },
});
