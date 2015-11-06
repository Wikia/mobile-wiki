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

		scriptLoadedObserver: Em.observer('scriptLoaded.vk', function () {
			this.createWidget();
		}),

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
			if (!this.get('scriptLoadInitialized.vk')) {
				this.set('scriptLoadInitialized.vk', true);

				Em.$.getScript('//vk.com/js/api/openapi.js', () => {
					this.set('scriptLoaded.vk', true);
				});
			}
		},

		/**
		 * @returns {void}
		 */
		createWidget() {
			if (this.get('scriptLoaded.vk')) {
				const elementId = this.get('elementId'),
					data = this.get('data');

				window.VK.Widgets.Group(elementId, data, data.groupId);
			}
		},
	}
);
