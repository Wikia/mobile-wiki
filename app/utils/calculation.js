/**
 * Library with generic calculation functions
 */

/**
 * @typedef {Object} ContainerSize
 * @property {number} width
 * @property {number} height
 */

/**
 * Calculate container size based on max dimensions and aspect ratio of the content
 *
 * @param {number} maxWidth
 * @param {number} maxHeight
 * @param {number} contentWidth
 * @param {number} contentHeight
 * @returns {ContainerSize}
 */
export function containerSize(maxWidth, maxHeight, contentWidth, contentHeight) {
	const targetSize = {
		width: 0,
		height: 0
	};

	if (maxWidth < maxHeight) {
		targetSize.width = maxWidth;
		targetSize.height = Math.min(maxHeight, Math.floor(maxWidth * contentHeight / contentWidth));
	} else {
		targetSize.width = Math.min(maxWidth, Math.floor(maxHeight * contentWidth / contentHeight));
		targetSize.height = maxHeight;
	}

	return targetSize;
}
