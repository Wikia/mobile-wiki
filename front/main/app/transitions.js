/**
 * File required for liquid-fire addon to define the animations in.
 * @returns {void}
 */
export default function () {
	const liquidFireSlideToLeftContainer = '.liquid-fire-slide-to-left-container',
		liquidFireSlideToLeftItem = '.liquid-fire-slide-to-left-item',
		duration = 450;

	this.transition(
		this.childOf(liquidFireSlideToLeftContainer),
		this.use('explode', {
			pickOld: liquidFireSlideToLeftItem,
			use: ['wait', duration]
		}, {
			pickNew: liquidFireSlideToLeftItem,
			use: ['toLeft', {duration, easing: 'easeInSine'}]
		})
	);
}
