import Mixin from '@ember/object/mixin';

export default Mixin.create({
  /**
  * Constructs a localized message wall post notification body
  * @param {Ember.Object} model
  * @returns {string}
  */
  getMessageWallPostRemovedBody(model) {
    const postTitle = this.postTitleMarkup;
    // "<b>Message removed</b> from your wall <br><br> {postTitle}"
    return this.getTranslatedMessage('notifications-own-wall-post-removed', {
        postTitle: postTitle,
    }); 
  },
});
