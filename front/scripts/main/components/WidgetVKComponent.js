/**
 * Widgets
 * @typedef {Object} Widgets
 * @property {Function} Group
 */

/**
 * VK
 * @typedef {Object} VK
 * @property {Widgets} [Widgets]
 */

/**
 * Window
 * @typedef {Object} Window
 * @property {VK} [VK]
 */

App.WidgetVKComponent = Em.Component.extend(
	App.WidgetScriptStateMixin,
	{
		classNames: ['widget-vk'],
		data: null,

		scriptLoadedObserver: Em.observer('scriptLoaded.vk', function (): void {
			this.createWidget();
		}),

		/**
		 * @returns {void}
		 */
		didInsertElement(): void {
			this.loadScript();
			this.createWidget();
		},

		/**
		 * @returns {void}
		 */
		loadScript(): void {
			if (!this.get('scriptLoadInitialized.vk')) {
				this.set('scriptLoadInitialized.vk', true);

				Em.$.getScript('//vk.com/js/api/openapi.js', (): void => {
					this.set('scriptLoaded.vk', true);
				});
			}
		},

		/**
		 * @returns {void}
		 */
		createWidget(): void {
			if (this.get('scriptLoaded.vk')) {
				var elementId = this.get('elementId'),
					data = this.get('data');

				window.VK.Widgets.Group(elementId, data, data.groupId);
			}
		},
	}
);
