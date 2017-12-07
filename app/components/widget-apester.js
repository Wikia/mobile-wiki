import Component from '@ember/component';
import WidgetScriptStateMixin from '../mixins/widget-script-state';
import RenderComponentMixin from '../mixins/render-component';

export default Component.extend(WidgetScriptStateMixin, RenderComponentMixin, {
	classNames: ['widget-apester'],
	data: null,

	/**
	 * @returns {void}
	 */
	didInsertElement() {
		this._super(...arguments);

		this.loadScript();
		this.createWidget();
	},

	/**
	 * @returns {void}
	 */
	loadScript() {
		$script('//static.apester.com/js/sdk/v2.0/apester-javascript-sdk.min.js', () => {
			this.set('scriptLoaded.apester', true);
		});
	},

	/**
	 * @returns {void}
	 */
	createWidget() {
		if (this.get('scriptLoaded.apester')) {
			window.APESTER.reload();
		}
	}

});
