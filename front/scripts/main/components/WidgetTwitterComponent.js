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

App.WidgetTwitterComponent = Em.Component.extend(
	App.WidgetScriptStateMixin,
	{
		classNames: ['widget-twitter'],
		data: null,

		scriptLoadedObserver: Em.observer('scriptLoaded.twitter', function () {
			this.createTimeline();
		}),

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			this.loadScript();
			this.createTimeline();
		},

		/**
		 * @returns {void}
		 */
		loadScript() {
			if (!this.get('scriptLoadInitialized.twitter')) {
				this.set('scriptLoadInitialized.twitter', true);

				Em.$.getScript('//platform.twitter.com/widgets.js', () => {
					this.set('scriptLoaded.twitter', true);
				});
			}
		},

		/**
		 * @returns {void}
		 */
		createTimeline() {
			if (this.get('scriptLoaded.twitter')) {
				const data = this.get('data');

				window.twttr.widgets.createTimeline(data.widgetId, this.$()[0], data);
			}
		},
	}
);
