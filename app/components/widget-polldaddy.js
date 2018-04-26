import Component from '@ember/component';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(RenderComponentMixin, {
	classNames: ['widget-polldaddy'],
	layoutName: 'components/widget-polldaddy',
	data: null,

	/**
	 * @returns {void}
	 */
	didRender() {
		this._super(...arguments);

		/**
		 * Warning: as we're using user provided ID number to construct ID of an element it HAS TO BE
		 * unique on the page - in other words: including widget for the SECOND time will not have any
		 * effect - all content will be rendered inside FIRST element, overriding it.
		 */
		this.loadScript();
	},

	/**
	 * @returns {void}
	 */
	loadScript() {
		const id = this.get('data.id');
		const script = document.createElement('script');

		script.src = `//static.polldaddy.com/p/${id}.js`;
		document.head.appendChild(script);
	},
});
