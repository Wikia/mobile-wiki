define('mobile-wiki/components/widget-vk', ['exports', 'mobile-wiki/mixins/widget-script-state'], function (exports, _widgetScriptState) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = Ember.Component.extend(_widgetScriptState.default, {
		classNames: ['widget-vk'],
		data: null,

		scriptLoadedObserver: Ember.observer('scriptLoaded.vk', function () {
			this.createWidget();
		}),

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

			if (!this.get('scriptLoadInitialized.vk')) {
				this.set('scriptLoadInitialized.vk', true);

				Ember.$.getScript('//vk.com/js/api/openapi.js', function () {
					_this.set('scriptLoaded.vk', true);
				});
			}
		},


		/**
   * @returns {void}
   */
		createWidget: function createWidget() {
			if (this.get('scriptLoaded.vk')) {
				var elementId = this.get('elementId'),
				    data = this.get('data');

				window.VK.Widgets.Group(elementId, data, data.groupId);
			}
		}
	});
});