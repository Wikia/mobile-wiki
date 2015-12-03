/**
 * Check if user has permissions to perform selected operation
 * @param {any} post
 * @param {string} permission
 * @returns {boolean}
 */
export function checkPermissions(post, permission) {
	const userData = Ember.get(post, '_embedded.userData'),
		permissions = userData && userData[0].permissions;

	return permissions && permissions.contains(permission);
}
