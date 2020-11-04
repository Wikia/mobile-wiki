import Mixin from '@ember/object/mixin';
import { getMessageWallOwner } from '../utils/messagewall';

export default Mixin.create({
  /**
  * Constructs a localized message wall post notification body
  * @param {Ember.Object} model
  * @returns {string}
  */
  getMessageWallPostBody(model) {
    const firstReplierName = model.get('latestActors.0.name') || this.getTranslatedMessage('username-anonymous');
    const wallOwner = getMessageWallOwner(model.get('url'));
    const isOwnWall = this.usernameMarkup === wallOwner;

    if (isOwnWall) {
        // "{user} left a <b>new message</b> on your wall <br><br> {postTitle}",
        return this.getTranslatedMessage('notifications-own-wall-post', {
            user: firstReplierName,
            postTitle: this.postTitleMarkup,
        });
    }
    // "{firstUser} left a <b>new message</b> on {secondUser}'s wall <br><br> {postTitle}"
    return this.getTranslatedMessage('notifications-wall-post', {
        firstUser: firstReplierName,
        secondUser: model.get('latestActors.1.name'),
        postTitle: this.postTitleMarkup,
    });
  },
});
