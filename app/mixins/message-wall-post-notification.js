import Mixin from '@ember/object/mixin';

export default Mixin.create({
  /**
  * Constructs a localized message wall post notification body
  * @param {Ember.Object} model
  * @returns {string}
  */
  getMessageWallPostBody(model) {
    const firstReplierName = model.get('latestActors.0.name'); // what about anons?
    const postTitle = this.postTitleMarkup;

    // need this data !!
    const isOwnWall = firstReplierName === '// check model.uri for username? in Message Wall uri';
    // check for is own wall
    if (isOwnWall) {
        return this.getTranslatedMessage('notifications-own-wall-post', {
            user: firstReplierName,
            postTitle: postTitle,
        });
    }
    
    return this.getTranslatedMessage('notifications-wall-post', {
        firstUser: firstReplierName,
        secondUser: model.get('latestActors.1.name'),
        postTitle: postTitle,
    });
  },
});
