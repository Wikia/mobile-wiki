import Component from '@ember/component';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
	classNames: ['widget-playbuzz'],
	data: null,

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this._super(...arguments);

		$script(`https://cdn.playbuzz.com/widget/feed.js`);
	}
});
