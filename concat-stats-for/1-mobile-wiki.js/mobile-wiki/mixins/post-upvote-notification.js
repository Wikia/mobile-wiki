define('mobile-wiki/mixins/post-upvote-notification', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var Mixin = Ember.Mixin;
	exports.default = Mixin.create({
		/**
   * Constructs a localized post upvote notification body
   * @param {Ember.Object} model
   * @returns {string}
   */
		getPostUpvoteMessageBody: function getPostUpvoteMessageBody(model) {
			var hasTitle = model.get('title'),
			    totalUniqueActors = model.get('totalUniqueActors'),
			    hasMultipleUsers = totalUniqueActors > 1;

			if (hasTitle) {
				if (hasMultipleUsers) {
					return this.getTranslatedMessage('notifications-post-upvote-multiple-users-with-title', {
						postTitle: this.get('postTitleMarkup'),
						number: totalUniqueActors
					});
				} else {
					return this.getTranslatedMessage('notifications-post-upvote-single-user-with-title', {
						postTitle: this.get('postTitleMarkup')
					});
				}
			} else if (hasMultipleUsers) {
				return this.getTranslatedMessage('notifications-post-upvote-multiple-users-no-title', {
					number: totalUniqueActors
				});
			} else {
				return this.getTranslatedMessage('notifications-post-upvote-single-user-no-title');
			}
		}
	});
});