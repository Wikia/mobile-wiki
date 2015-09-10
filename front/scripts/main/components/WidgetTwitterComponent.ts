/// <reference path="../mixins/WidgetScriptStateMixin.ts" />
'use strict';

interface Window {
	twttr?: {
		widgets?: {
			createTimeline: Function;
		};
	};
}

App.WidgetTwitterComponent = Em.Component.extend(App.WidgetScriptStateMixin, {
	classNames: ['widget-twitter'],

	data: null,

	scriptLoadedObserver: Em.observer('scriptLoaded.twitter', function (): void {
		if (this.get('scriptLoaded.twitter')) {
			this.createTimeline();
		}
	}),

	didInsertElement(): void {
		if (!this.get('scriptLoadInitialized.twitter')) {
			this.set('scriptLoadInitialized.twitter', true);

			Em.$.getScript('//platform.twitter.com/widgets.js', (): void => {
				this.set('scriptLoaded.twitter', true);
			});
		}
	},

	createTimeline(): void {
		var data = this.get('data');

		window.twttr.widgets.createTimeline(
			data.widgetId,
			this.$()[0],
			data
		);
	}
});
