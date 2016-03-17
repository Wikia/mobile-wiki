import Ember from 'ember';
import DiscussionUserPermissions from 'user-permissions';

const DiscussionUserData = Ember.object.extend({
	hasReported: null,
	hasUpvoted: null,
	permissions: null,

	/**
	 * @param {object} userData
	 *
	 * @returns {object}
	 */
	create(userData) {
		return this._super({
			hasReported: userData.hasReported,
			hasUpvoted: userData.hasUpvoted,
			permissions: DiscussionUserPermissions.create(userData.permissions)
		});
	}
});

export default DiscussionUserData;
