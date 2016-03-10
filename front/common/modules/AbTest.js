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
 * Integrates AbTest with Universal Analytics
 *
 * @param {Array} dimensions
 * @returns {Array}
 */
export function integrateAbTestWithUA(dimensions) {
	if (!AbTest) {
		return dimensions;
	}

	const abList = AbTest.getExperiments(true);

	for (let abIndex = 0; abIndex < abList.length; abIndex++) {
		const abExp = abList[abIndex],
			abSlot = AbTest.getGASlot(abExp.name);

		if (abExp && abExp.flags && abExp.flags.ga_tracking) {
			// GA Slots 40-49 are reserved for our AB Testing tool. Anything outside that
			// range could potentially overwrite something that we don't want to
			if (abSlot >= 40 && abSlot <= 49) {
				const noGroup = abList.nouuid ? 'NOBEACON' : 'NOT_IN_ANY_GROUP',
					abGroupName = abExp.group ? abExp.group.name : noGroup;

				dimensions[abSlot] = abGroupName;
			}
		}
	}

	return dimensions;
}
