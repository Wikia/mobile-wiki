import Mixin from '@ember/object/mixin';
import { getMessageWallOwner, getPossiblyAnonActorName } from '../utils/message-wall';

export default Mixin.create({
  /**
  * Constructs a localized message wall post notification body
  * @param {Ember.Object} model
  * @returns {string}
  */
  getMessageWallPostBody(model) {
    let wallOwner = model.get('metadata') && model.get('metadata.username');

    if (!wallOwner) {
      wallOwner = getMessageWallOwner(model.get('uri'));
    }

    const isOwnWall = wallOwner === this.usernameMarkup;
    const args = {
      postTitle: this.postTitleMarkup,
      wallOwner,
    };

    if (isOwnWall) {
      // "{user} left a <b>new message</b> on your wall <br><br> {postTitle}",
      args.user = getPossiblyAnonActorName(model);
      return this.getTranslatedMessage('notifications-own-wall-post', args);
    }

    args.firstUser = getPossiblyAnonActorName(model);
    // "{firstUser} left a <b>new message</b> on {wallOwner}'s wall <br><br> {postTitle}"
    return this.getTranslatedMessage('notifications-wall-post', args);
  },
});
