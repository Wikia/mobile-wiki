/**
 * Check if user has permissions to perform selected operation
 * @param {any} post
 * @param {string} permission
 * @returns {boolean}
 */
export function checkPermissions(post, permission) {
	const userData = post && Ember.get(post, '_embedded.userData'),
		permissions = userData && userData[0].permissions;

	if (!userData) {
		return false;
	} else {
		return permissions && permissions.contains(permission);
	}
}
