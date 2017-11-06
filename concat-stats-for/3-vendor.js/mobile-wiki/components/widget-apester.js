define('mobile-wiki/components/widget-apester', ['exports', 'mobile-wiki/mixins/widget-script-state'], function (exports, _widgetScriptState) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_widgetScriptState.default, {
		classNames: ['widget-apester'],
		data: null,

		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			this.loadScript();
			this.createWidget();
		},


		/**
   * @returns {void}
   */
		loadScript: function loadScript() {
			var _this = this;

			$script('//static.apester.com/js/sdk/v2.0/apester-javascript-sdk.min.js', function () {
				_this.set('scriptLoaded.apester', true);
			});
		},


		/**
   * @returns {void}
   */
		createWidget: function createWidget() {
			if (this.get('scriptLoaded.apester')) {
				window.APESTER.reload();
			}
		}
	});
});