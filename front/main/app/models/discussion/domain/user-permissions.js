import Ember from 'ember';

const DiscussionUserPermissions = Ember.Object.extend({
	canDelete: false,
	canEdit: false,
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
	 * @returns {Ember.Object}
	 */
	create(permissionsData = []) {
		const permissions = {};

		permissionsData.forEach((permission) => {
			permissions[permission] = true;
		});

		return this._super(permissions);
	}
});

export default DiscussionUserPermissions;
