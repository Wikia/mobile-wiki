/// <reference path="../mixins/WidgetScriptStateMixin.ts" />
'use strict';

/**
 * Widgets
 * @typedef {object} Widgets
 * @property {Function} createTimeline
 */

/**
 * Twttr
 * @typedef {object} Twttr
 * @property {Widgets} [widgets]
 */

/**
 * Window
 * @typedef {object} Window
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
		 * @returns {void}
		 */
		didInsertElement(): void {
			this.loadScript();
			this.createTimeline();
		},

		/**
		 * @returns {void}
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
		 * @returns {void}
		 */
		createTimeline(): void {
			if (this.get('scriptLoaded.twitter')) {
				var data = this.get('data');
				window.twttr.widgets.createTimeline(data.widgetId, this.$()[0], data);
			}
		},
	}
);
