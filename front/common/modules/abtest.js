const AbTest = window.Wikia && window.Wikia.AbTest;

/**
 * Get the users group for an experiment
 *
 * @param {String} experimentName
 * @returns {String}
 */
export function getGroup(experimentName) {
	if (AbTest && typeof AbTest.getGroup === 'function') {
		return AbTest.getGroup(experimentName);
	}
}

/**
 * Check if a user is in a group for an experiment
 *
 * @param {String} experimentName
 * @param {String} groupName
 * @returns {Boolean}
 */
export function inGroup(experimentName, groupName) {
	if (AbTest && typeof AbTest.inGroup === 'function') {
		return AbTest.inGroup(experimentName, groupName);
	}
}
