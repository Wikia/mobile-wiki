import Ember from 'ember';

const {Mixin, inject} = Ember;

/**
 * Mixin wrapping functionality of ui-responsive Ember addon to keep it's
 * customization in the one place.
 *
 * Addon allows to check on which device - mobile or desktop user currently is,
 * viewport, screen and body sizes.
 * Example usage:
 * 	this.get('responsive.isDesktop')
 * more: https://github.com/lifegadget/ui-responsive
 */
export default Mixin.create({
	responsive: inject.service(),

	/**
	 * Keep this values in sync with $mobile-range and $desktop-range from _settings.scss
	 */
	breakpoints: [
		{id: 'mobile', max: 1063},
		{id: 'desktop', min: 1064}
	],

	init() {
		this._super();
		this.get('responsive').setBreakpoints(this.get('breakpoints'));
	}
});
