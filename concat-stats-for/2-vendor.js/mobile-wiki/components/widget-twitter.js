define('mobile-wiki/components/widget-twitter', ['exports', 'mobile-wiki/mixins/widget-script-state'], function (exports, _widgetScriptState) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var $ = Ember.$;
	var observer = Ember.observer;
	var Component = Ember.Component;
	exports.default = Component.extend(_widgetScriptState.default, {
		classNames: ['widget-twitter'],
		data: null,

		scriptLoadedObserver: observer('scriptLoaded.twitter', function () {
			this.createTimeline();
		}),

		/**
   * @returns {void}
   */
		didInsertElement: function didInsertElement() {
			this.loadScript();
			this.createTimeline();
		},


		/**
   * @returns {void}
   */
		loadScript: function loadScript() {
			var _this = this;

			if (!this.get('scriptLoadInitialized.twitter')) {
				this.set('scriptLoadInitialized.twitter', true);

				$.getScript('//platform.twitter.com/widgets.js', function () {
					_this.set('scriptLoaded.twitter', true);
				});
			}
		},


		/**
   * @returns {void}
   */
		createTimeline: function createTimeline() {
			if (this.get('scriptLoaded.twitter')) {
				var data = this.get('data');

				window.twttr.widgets.createTimeline(data.widgetId, this.$()[0], data);
			}
		}
	});
});