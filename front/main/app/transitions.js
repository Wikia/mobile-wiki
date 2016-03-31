/**
 * File required for liquid-fire addon to define the animations in.
 * @returns {void}
 */
export default function () {
	const liquidFireSlideToLeftContainer = '.liquid-fire-slide-to-left-container',
		liquidFireSlideToLeftItem = '.liquid-fire-slide-to-left-item',
		durationOut = 1250,
		durationIn = 1250;

	this.transition(
		this.childOf(liquidFireSlideToLeftContainer),
		this.use('explode', {
			pickOld: liquidFireSlideToLeftItem,
			use: ['fade', {duration: durationOut}]
		}, {
			pickNew: liquidFireSlideToLeftItem,
			use: ['toLeft', {duration: durationIn, easing: 'easeInSine'}]
		})
	);
}
