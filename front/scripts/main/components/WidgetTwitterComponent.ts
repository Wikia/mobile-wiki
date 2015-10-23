/// <reference path="../mixins/WidgetScriptStateMixin.ts" />
'use strict';

/**
 * Widgets
 * @typedef {Object} Widgets
 * @property {Function} createTimeline
 */

/**
 * Twttr
 * @typedef {Object} Twttr
 * @property {Widgets} [widgets]
 */

/**
 * Window
 * @typedef {Object} Window
 * @property {Twttr} [twttr]
 */

interface Window {
	twttr?: {
		widgets?: {
			createTimeline: Function;
		};
	};
}

App.WidgetTwitterComponent = Em.Component.extend(
	App.WidgetScriptStateMixin,
	{
		classNames: ['widget-twitter'],
		data: null,

		scriptLoadedObserver: Em.observer('scriptLoaded.twitter', function (): void {
			this.createTimeline();
		}),

		/**
		 * @returns {undefined}
		 */
		didInsertElement(): void {
			this.loadScript();
			this.createTimeline();
		},

		/**
		 * @returns {undefined}
		 */
		loadScript(): void {
			if (!this.get('scriptLoadInitialized.twitter')) {
				this.set('scriptLoadInitialized.twitter', true);

				Em.$.getScript('//platform.twitter.com/widgets.js', (): void => {
					this.set('scriptLoaded.twitter', true);
				});
			}
		},

		/**
		 * @returns {undefined}
		 */
		createTimeline(): void {
			if (this.get('scriptLoaded.twitter')) {
				var data = this.get('data');
				window.twttr.widgets.createTimeline(data.widgetId, this.$()[0], data);
			}
		},
	}
);
