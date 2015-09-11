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

	elementId: null,
	options: null,
	groupId: null,

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
			var elementId = this.get('elementId');
			var groupId = this.get('data.groupId');
			var data = this.get('data');

			window.VK.Widgets.Group(elementId, data, groupId);
		}
	}
});
