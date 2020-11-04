import Mixin from '@ember/object/mixin';
import { getMessageWallOwner } from '../utils/messagewall';

export default Mixin.create({
  /**
  * Constructs a localized reply notification body
  * @param {Ember.Object} model
  * @returns {string}
  */
  getMessageWallReplyBody(model) {
    const totalUniqueActors = model.get('totalUniqueActors');
    const hasTwoOrMoreUsers = totalUniqueActors > 1;
    const firstReplierName = model.get('latestActors.0.name') || this.getTranslatedMessage('username-anonymous');
    const wallOwner = getMessageWallOwner(model.get('url'));
    const isOwnWall = this.usernameMarkup === wallOwner;

    if (hasTwoOrMoreUsers) {
        if (isOwnWall) {
            // "{user} and {number} other users <b>replied</b> to a message on your wall <br><br> {postTitle}",
            return this.getTranslatedMessage('notifications-own-wall-reply-multiple-users', {
                user: firstReplierName,
                number: totalUniqueActors - 1,
                postTitle: this.postTitleMarkup,
            });
        } else {
            //  "{firstUser} and {number} other users <b>replied</b> to {secondUser}'s wall <br><br> {postTitle}"
            return this.getTranslatedMessage('notifications-wall-reply-multiple-users', {
                firstUser: firstReplierName,
                secondUser: model.get('latestActors.1.name'),
                number: totalUniqueActors - 1,
                postTitle: this.postTitleMarkup,
            });
        }
    }

    if (isOwnWall) {
        // "{user} <b>replied</b> to a message on your wall <br><br> {postTitle}"
        return this.getTranslatedMessage('notifications-own-wall-reply', {
            user: firstReplierName,
            postTitle: this.postTitleMarkup,
        });
    }
    // "{firstUser} <b>replied</b> to {secondUser}'s message <br><br> {postTitle}"
    return this.getTranslatedMessage('notifications-wall-reply', {
        firstUser: firstReplierName,
        secondUser: model.get('latestActors.1.name'),
        postTitle: this.postTitleMarkup,
    })
  },
});
