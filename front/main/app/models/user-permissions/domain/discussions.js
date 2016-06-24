import Ember from 'ember';

const permissionsMap = {
	canReadCategories: 'forums:read',
	canCreateCategories: 'forums:create',
	canDeleteCategories: 'forums:delete',
	canEditCategories: 'forums:edit',
	canReorderCategories: 'forums:displayorder',
	canChangePostCategory: 'threads:move'
};

const DiscussionUserPermissions = Ember.Object.extend({
	canReadCategories: false,
	canCreateCategories: false,
	canEditCategories: false,
	canReorderCategories: false,
	canChangePostCategory: false
});

DiscussionUserPermissions.reopenClass({
	/**
	 * @param {Object} permissionsData
	 *
	 * @returns {Ember.Object}
	 */
	create(permissionsData) {
		const permissions = {};

		Object.keys(permissionsMap).forEach((permission) => {
			if (permissionsData.hasOwnProperty(permissionsMap[permission]) || permissionsData.indexOf('*') !== -1) {
				permissions[permission] = true;
			}
		});

		return this._super(permissions);
	}
});

export default DiscussionUserPermissions;
