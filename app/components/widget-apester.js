import Component from '@ember/component';
import WidgetScriptStateMixin from '../mixins/widget-script-state';

export default Component.extend(WidgetScriptStateMixin, {
	classNames: ['widget-apester'],
	data: null,

	/**
	 * @returns {void}
	 */
	didInsertElement() {
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
