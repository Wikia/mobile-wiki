import Ember from 'ember';
import DiscussionUserPermissions from './user-permissions';

const DiscussionUserData = Ember.Object.extend({
	hasReported: null,
	hasUpvoted: null,
	permissions: null,
});

DiscussionUserData.reopenClass({
	/**
	 * @param {object} userData
	 *
	 * @returns {Ember.Object}
	 */
	create(userData) {
		let user = userData;

		/*
		 * if it's gotten from followed-by end-point we get userData in plain object,
		 * not in an array, we still need to support /threads end-point with an array result
		 */
		if (Array.isArray(userData)) {
			user = userData[0];
		}

		return this._super({
			hasReported: user.hasReported,
			hasUpvoted: user.hasUpvoted,
			permissions: DiscussionUserPermissions.create(user.permissions)
		});
	}
});

export default DiscussionUserData;
