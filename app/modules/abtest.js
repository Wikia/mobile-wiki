/**
 * Get the users group for an experiment
 *
 * @param {String} experimentName
 * @returns {String|void}
 */
export function getGroup(experimentName) {
	const AbTest = window.Wikia && window.Wikia.AbTest;

	if (AbTest && typeof AbTest.getGroup === 'function') {
		return AbTest.getGroup(experimentName);
	}

	return undefined;
}

/**
 * Check if a user is in a group for an experiment
 *
 * @param {String} experimentName
 * @param {String} groupName
 * @returns {Boolean}
 */
export function inGroup(experimentName, groupName) {
	const AbTest = window.Wikia && window.Wikia.AbTest;

	if (AbTest && typeof AbTest.inGroup === 'function') {
		return AbTest.inGroup(experimentName, groupName);
	}

	return false;
}
