import Component from '@ember/component';

export default Component.extend({
	classNames: ['widget-playbuzz'],
	data: null,

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		$script(`https://cdn.playbuzz.com/widget/feed.js`);
	}
});
