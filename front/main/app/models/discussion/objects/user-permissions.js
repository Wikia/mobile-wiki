import Ember from 'ember';

const DiscussionUserPermissions = Ember.Object.extend({
	canDelete: false,
	canLock: false,
	canModerate: false,
	canUndelete: false,
	canUnlock: false,
});

DiscussionUserPermissions.reopenClass({
	/**
	 * Creates a permissions dict from API's permissions array
	 *
	 * @param {object} permissionsData
	 *
	 * @returns {object}
	 */
	create(permissionsData) {
		const permissions = {};

		permissionsData.forEach((permission) => permissions[permission] = true);

		return this._super(permissions);
	}
});

export default DiscussionUserPermissions;
