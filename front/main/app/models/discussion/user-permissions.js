import Ember from 'ember';

const DiscussionUserPermissions = Ember.Object.extend({
	canDelete: false,
	canLock: false,
	canModerate: false,
	canUndelete: false,
	canUnlock: false,

	/**
	 * Creates a permissions dict from API's permissions array
	 *
	 * @param permissionsData
	 */
	create(permissionsData) {
		const permissions = {};

		permissionsData.forEach(function (permission) {
			permissions[permission] = true;
		});

		this._super(permissions);
	}
});

export default DiscussionUserPermissions;
