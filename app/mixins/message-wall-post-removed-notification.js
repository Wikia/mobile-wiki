import Mixin from '@ember/object/mixin';

export default Mixin.create({
  /**
  * Constructs a localized message wall post removed notification body
  * @returns {string}
  */
  getMessageWallPostRemovedBody() {
    // "<b>Message removed</b> from your wall <br><br> {postTitle}"
    return this.getTranslatedMessage('notifications-own-wall-post-removed', {
      postTitle: this.postTitleMarkup,
    });
  },
});
