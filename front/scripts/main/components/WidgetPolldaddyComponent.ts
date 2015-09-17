/// <reference path="../mixins/WidgetScriptStateMixin.ts" />
'use strict';

App.WidgetPolldaddyComponent = Em.Component.extend({
	classNames: ['widget-polldaddy'],
	layoutName: 'components/widget-polldaddy',
	data: null,

	didInsertElement(): void {
		this.loadScript();
	},

	loadScript(): void {
		var id = this.get('data').id;
		Em.$.getScript(`//static.polldaddy.com/p/${id}.js`);
	}
});
