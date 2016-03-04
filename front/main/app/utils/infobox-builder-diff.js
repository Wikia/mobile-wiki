/**
 * @desc Provides information about whether and which elements'
 * values have been changed, basing on previously saved original data.
 *
 * @param {Object} originalData data in form as it was when opening infobox builder
 * @param {Object} data current infobox builder state
 * @returns {Object}
 */
export function createTitleDiff(originalData, data) {
	const changes = [];

	if (typeof originalData.defaultValue === 'undefined') {
		return changes;
	}

	if (data.defaultValue !== originalData.defaultValue) {
		changes.push({
			type: 'title',
			changedField: 'defaultValue'
		});
	}

	return changes;
}

/**
 * @desc Provides information about whether and which elements'
 * values have been changed, basing on previously saved original data.
 *
 * @param {Object} originalData data in form as it was when opening infobox builder
 * @param {Object} data current infobox builder state
 * @returns {Object}
 */
export function createRowDiff(originalData, data) {
	const changes = [];

	if (typeof originalData.label === 'undefined') {
		return changes;
	}

	if (data.label !== originalData.label) {
		changes.push({
			type: 'row',
			changedField: 'label'
		});
	}

	return changes;
}

/**
 * @desc Provides information about whether and which elements'
 * values have been changed, basing on previously saved original data.
 *
 * @param {Object} originalData data in form as it was when opening infobox builder
 * @param {string} value section header value
 * @param {boolean} collapsible
 * @returns {Object}
 */
export function createSectionHeaderDiff(originalData, value, collapsible) {
	const changes = [];

	if (typeof originalData.collapsible === 'undefined' && typeof originalData.value === 'undefined') {
		return changes;
	}

	if (value !== originalData.value) {
		changes.push({
			type: 'section-header',
			changedField: 'value'
		});
	}

	if (collapsible !== originalData.collapsible) {
		changes.push({
			type: 'section-header',
			changedField: 'collapsible'
		});
	}

	return changes;
}

/**
 * @desc Factory that returns diff function based on the item type
 *
 * @param {String} type
 * @returns {Function|null}
 */
export function getDiffFunctionForItem(type) {
	switch (type) {
		case 'title':
			return createTitleDiff;
		case 'row':
			return createRowDiff;
		case 'section-header':
			return createSectionHeaderDiff;
		default:
			Ember.Logger.debug(`Diff for item with type ${type} is not available`);
			return null;
	}
}

/**
 * @desc Provides information about whether and which elements'
 * values have been changed, basing on previously saved original data.
 *
 * @param {Object} currentState
 * @returns {Array} of Objects with element type and changed property
 */
export default function (currentState) {
	const diffs = [];
	let diff = [];

	currentState
		.filter((item) => item.infoboxBuilderData.originalData)
		.forEach((item) => {
			const diffFunction = getDiffFunctionForItem(item.type);

			if (typeof diffFunction === 'function') {
				diff = diffFunction(
					item.infoboxBuilderData.originalData,
					item.data,
					item.collapsible
				);

				diffs.push(...diff);
			}
		});

	return diffs;
}
