/// <reference path="../mixins/WidgetScriptStateMixin.ts" />
'use strict';

interface Window {
	VK?: {
		Widgets?: {
			Group: Function;
		};
	};
}

App.WidgetVKComponent = Em.Component.extend(App.WidgetScriptStateMixin, {
	classNames: ['widget-vk'],

	data: null,

	scriptLoadedObserver: Em.observer('scriptLoaded.vk', function (): void {
		this.createWidget();
	}),

	didInsertElement(): void {
		this.loadScript();
		this.createWidget();
	},

	loadScript(): void {
		if (!this.get('scriptLoadInitialized.vk')) {
			this.set('scriptLoadInitialized.vk', true);

			Em.$.getScript('//vk.com/js/api/openapi.js', (): void => {
				this.set('scriptLoaded.vk', true);
			});
		}
	},

	createWidget(): void {
		if (this.get('scriptLoaded.vk')) {
			var elementId = this.get('elementId'),
				data = this.get('data');

			window.VK.Widgets.Group(elementId, data, data.groupId);
		}
	}
});
