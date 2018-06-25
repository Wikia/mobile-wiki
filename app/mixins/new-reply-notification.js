import Mixin from '@ember/object/mixin';

export default Mixin.create({
	/**
	 * Constructs a localized reply notification body
	 * @param {Ember.Object} model
	 * @returns {string}
	 */
	getReplyMessageBody(model) {
		const hasTitle = model.get('title'),
			totalUniqueActors = model.get('totalUniqueActors'),
			hasTwoUsers = totalUniqueActors === 2,
			hasThreeOrMoreUsers = totalUniqueActors > 2,
			firstReplierName = model.get('latestActors.0.name');

		if (hasTitle) {
			if (hasThreeOrMoreUsers) {
				return this.getTranslatedMessage('notifications-replied-by-multiple-users-with-title', {
					postTitle: this.postTitleMarkup,
					mostRecentUser: firstReplierName,
					number: totalUniqueActors - 1
				});
			} else if (hasTwoUsers) {
				return this.getTranslatedMessage('notifications-replied-by-two-users-with-title', {
					firstUser: firstReplierName,
					secondUser: model.get('latestActors.1.name'),
					postTitle: this.postTitleMarkup,
				});
			} else {
				return this.getTranslatedMessage('notifications-replied-by-with-title', {
					user: firstReplierName,
					postTitle: this.postTitleMarkup,
				});
			}
		} else if (hasThreeOrMoreUsers) {
			return this.getTranslatedMessage('notifications-replied-by-multiple-users-no-title', {
				username: this.usernameMarkup,
				mostRecentUser: firstReplierName,
				number: totalUniqueActors - 1
			});
		} else if (hasTwoUsers) {
			return this.getTranslatedMessage('notifications-replied-by-two-users-no-title', {
				firstUser: firstReplierName,
				secondUser: model.get('latestActors.1.name'),
			});
		} else {
			return this.getTranslatedMessage('notifications-replied-by-no-title', {
				user: firstReplierName,
			});
		}
	}
});
