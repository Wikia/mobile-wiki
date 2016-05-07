/**
 * Ember-pop-over addon configuration
 * Specifies allowed flows for pop-over component
 */

/**
 * Flow pop-over around target element
 *
 * @returns {*}
 */
export function around() {
	return this.orientAbove.andSnapTo(this.center, this.leftEdge, this.rightEdge)
		.then(this.orientRight.andSlideBetween(this.bottomEdge, this.topEdge))
		.then(this.orientBelow.andSnapTo(this.center, this.rightEdge, this.leftEdge))
		.then(this.orientLeft.andSlideBetween(this.topEdge, this.bottomEdge))
		.then(this.orientAbove.andSnapTo(this.center));
}

/**
 * Flow pop-over as dropdown - below, then left, then right
 *
 * @returns {*}
 */
export function dropdown() {
	return this.orientBelow.andSnapTo(this.center, this.rightEdge, this.leftEdge)
		.then(this.orientLeft.andSnapTo(this.topEdge, this.bottomEdge))
		.then(this.orientRight.andSnapTo(this.topEdge))
		.then(this.orientBelow.andSnapTo(this.center));
}

/**
 * Flow pop-over above or below target
 *
 * @returns {*}
 */
export function flip() {
	return this.orientAbove.andSlideBetween(this.rightEdge, this.leftEdge)
		.where((boundingRect, _, targetRect) => {
			const centerY = targetRect.height / 2 + targetRect.y,
				halfway = boundingRect.height / 2;

			return centerY > halfway;
		})
		.then(
			this.orientBelow.andSlideBetween(this.rightEdge, this.leftEdge)
		)
		.where((boundingRect, _, targetRect) => {
			const centerY = targetRect.height / 2 + targetRect.y,
				halfway = boundingRect.height / 2;

			return centerY < halfway;
		})
	.then(this.orientAbove.andSnapTo(this.center));
}

/**
 * Flow pop-over above target
 *
 * @returns {*}
 */
export function popup() {
	return this.orientAbove.andSnapTo(this.center, this.rightEdge, this.leftEdge, this.center);
}

/**
 * Flow pop-over below target, centered
 *
 * @returns {*}
 */
export function downCentered() {
	return this.orientBelow.andSlideBetween(this.leftEdge, this.rightEdge);
}

/**
 * snaps to left center
 *
 * @returns {*}
 */
export function leftCenter() {
	return this.orientLeft.andSnapTo(this.center);
}

/**
 * snaps pop-over above target, on left edge
 *
 * @returns {*}
 */
export function topLeft() {
	return this.orientAbove.andSnapTo(this.leftEdge);
}

/**
 * snaps pop-over below target, on left edge
 *
 * @returns {*}
 */
export function bottomLeft() {
	return this.orientBelow.andSnapTo(this.leftEdge);
}
