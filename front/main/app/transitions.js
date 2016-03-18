/**
 * File required for liquid-fire addon to define the animations in.
 * @returns {void}
 */
export default function () {
	const infoboxBuilderSidebarId = '#infobox-builder-sidebar-liquid',
		infoboxBuilderSidebarAreaClass = '.infobox-builder-sidebar-area',
		durationOut = 200,
		durationIn = 350;

	this.transition(
		this.childOf(infoboxBuilderSidebarId),
		this.use('explode', {
			pickOld: infoboxBuilderSidebarAreaClass,
			use: ['fade', {duration: durationOut}]
		}, {
			pickNew: infoboxBuilderSidebarAreaClass,
			use: ['toLeft', {duration: durationIn, easing: 'easeInSine'}]
		})
	);
}
