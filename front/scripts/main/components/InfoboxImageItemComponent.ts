/// <reference path="../app.ts" />
'use strict';

App.InfoboxImageItemComponent = Em.Component.extend({
	tmpl: '<p>Jestem templatem skompilowanym</p>',

	layout: Em.computed(function() {
		var template = this.get('tmpl');
		return Em.Handlebars.compile(template);
	})
});
