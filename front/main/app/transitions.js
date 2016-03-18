/**
 * File required for liquid-fire addon to define the animations in.
 * @returns {void}
 */
export default function () {
	const durationOut = 300,
		durationIn = 400;

	this.transition(
		this.childOf('#infobox-builder-sidebar-liquid'),
		this.use('explode', {
			pickOld: '.infobox-builder-sidebar-area',
			use: ['toLeft', {duration: durationOut}]
		}, {
			pickNew: '.infobox-builder-sidebar-area',
			use: ['toLeft', {duration: durationIn}]
		}, {
			// For everything else that didn't match the above.
			use: ['toLeft', {duration: durationOut}]
		})
	);
}
