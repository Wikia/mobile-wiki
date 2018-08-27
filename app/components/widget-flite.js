import Component from '@ember/component';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
	classNames: ['widget-flite'],
	data: null,

	didInsertElement() {
		this._super(...arguments);

		this.element.innerHTML = this.getScriptTag();
	},

	getScriptTag() {
		const src = '//s.flite.com/syndication/combo.js';
		const guid = this.get('data.guid');
		const width = this.get('data.width');
		const height = this.get('data.height');

		// make sure globl configuration for this widget is initialized
		this.setUpConfig(guid);

		return `<script src="${src}" async="async" `
			+ `data-instance="${guid}" data-width="${width}" data-height="${height}"></`
			+ 'script>';
	},

	/**
	 * @param {string} guid
	 * @return {void}
	 */
	setUpConfig(guid) {
		window.FLITE = window.FLITE || {};
		window.FLITE.config = window.FLITE.config || {};
		window.FLITE.config[guid] = window.FLITE.config[guid] || {};
		window.FLITE.config[guid].ts = Number(new Date());
	},
});
