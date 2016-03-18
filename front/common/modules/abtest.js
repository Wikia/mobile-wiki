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
