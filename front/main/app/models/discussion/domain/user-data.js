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
		return this._super({
			hasReported: userData.hasReported,
			hasUpvoted: userData.hasUpvoted,
			permissions: DiscussionUserPermissions.create(userData.permissions)
		});
	}
});

export default DiscussionUserData;
