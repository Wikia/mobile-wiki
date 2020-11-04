import Mixin from '@ember/object/mixin';

export default Mixin.create({
  /**
  * Constructs a localized message wall post notification body
  * @param {Ember.Object} model
  * @returns {string}
  */
  getMessageWallPostRemovedBody(model) {
    const firstReplierName = model.get('latestActors.0.name'); // what about anons?
    const postTitle = this.postTitleMarkup;

    return this.getTranslatedMessage('notifications-own-wall-post-removed', {
        user: firstReplierName,
        postTitle: postTitle,
    }); 
  },
});
