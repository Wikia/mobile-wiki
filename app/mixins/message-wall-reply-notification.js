import Mixin from '@ember/object/mixin';
import { getMessageWallOwner, getPossiblyAnonActorName } from '../utils/message-wall';

export default Mixin.create({
  /**
  * Constructs a localized message wall reply notification body
  * @param {Ember.Object} model
  * @returns {string}
  */
  getMessageWallReplyBody(model) {
    let wallOwner = model.get('metadata') && model.get('metadata.username');

    if (!wallOwner) {
      wallOwner = getMessageWallOwner(model.get('uri'));
    }

    const isOwnWall = wallOwner === this.usernameMarkup;
    const args = {
      postTitle: this.postTitleMarkup,
      wallOwner,
    };

    if (model.get('totalUniqueActors') > 1) {
      args.number = model.get('totalUniqueActors') - 1;

      if (isOwnWall) {
        args.user = getPossiblyAnonActorName(model);
        // "{user} and {number} other users <b>replied</b> to a message on your wall <br><br> {postTitle}",
        return this.getTranslatedMessage('notifications-own-wall-reply-multiple-users', args);
      }

      args.firstUser = getPossiblyAnonActorName(model);
      args.secondUser = model.get('contentCreatorName');
      //  "{firstUser} and {number} other users <b>replied</b> to {secondUser}'s message on {wallOwner}'s wall <br><br> {postTitle}"
      return this.getTranslatedMessage('notifications-wall-reply-multiple-users', args);
    }

    if (isOwnWall) {
      args.user = this._getPossiblyAnonActorName(model);
      // "{user} <b>replied</b> to a message on your wall <br><br> {postTitle}"
      return this.getTranslatedMessage('notifications-own-wall-reply', args);
    }

    if (model.get('contentCreatorName') === this.usernameMarkup) {
      // Current user's own message
      args.user = getPossiblyAnonActorName(model);
      // "{user} <b>replied</b> to your message <br><br> {postTitle}"
      return this.getTranslatedMessage('notifications-wall-reply-own-message', args);
    }

    args.firstUser = getPossiblyAnonActorName(model);
    args.secondUser = model.get('contentCreatorName');
    // "{firstUser} <b>replied</b> to {secondUser}'s message <br><br> {postTitle}"
    return this.getTranslatedMessage('notifications-wall-reply', args);
  },
});
