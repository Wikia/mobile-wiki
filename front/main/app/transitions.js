/**
 * File required for liquid-fire addon to define the animations in.
 * @returns {void}
 */
export default function () {
	const durationOut = 200,
		durationIn = 350;

	this.transition(
		this.childOf('#infobox-builder-sidebar-liquid'),
		this.use('explode', {
			pickOld: '.infobox-builder-sidebar-area',
			use: ['fade', {duration: durationOut}]
		}, {
			pickNew: '.infobox-builder-sidebar-area',
			use: ['toLeft', {duration: durationIn, easing: "easeInSine"}]
		})
	);
}
