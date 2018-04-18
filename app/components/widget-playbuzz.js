import Component from '@ember/component';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
	classNames: ['widget-playbuzz'],
	data: null,

	/**
	 * @returns {void}
	 */
	didRender() {
		this._super(...arguments);

		const script = document.createElement('script');

		script.src = 'https://cdn.playbuzz.com/widget/feed.js';
		document.head.appendChild(script);
	}
});
