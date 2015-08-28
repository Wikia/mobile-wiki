/// <reference path="../app.ts" />
'use strict';

App.InfoboxTitleItemComponent = Em.Component.extend({
	tmpl: '<p>Jestem templatem skompilowanym title</p>',

	layout: Em.computed(function() {
		var template = this.get('tmpl');
		return Em.Handlebars.compile(template);
	})
});
