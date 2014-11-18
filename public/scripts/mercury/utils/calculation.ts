/// <reference path="../../baseline/mercury.d.ts" />

/**
 * @define calculation
 *
 * Library with generic calculation functions
 */
'use strict';

interface ContainerSize {
	width: number;
	height: number;
}

module Mercury.Utils.Calculation {
	/**
	 * Calculate container size based on max dimensions and aspect ratio of the content
	 *
	 * @param {number} maxWidth
	 * @param {number} maxHeight
	 * @param {number} contentWidth
	 * @param {number} contentHeight
	 * @return {ContainerSize}
	 */
	export function containerSize (
		maxWidth: number,
		maxHeight: number,
		contentWidth: number,
		contentHeight: number
		): ContainerSize {
		var targetSize: ContainerSize = {
			width: 0,
			height: 0
		};

		if (maxWidth < maxHeight) {
			targetSize.width = maxWidth;
			targetSize.height = Math.min(maxHeight, ~~(maxWidth * contentHeight / contentWidth));
		} else {
			targetSize.width = Math.min(maxWidth, ~~(maxHeight * contentWidth / contentHeight));
			targetSize.height = maxHeight;
		}

		return targetSize;
	}
}
