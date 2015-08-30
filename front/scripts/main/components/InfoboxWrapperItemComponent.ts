/// <reference path="../app.ts" />
'use strict';

App.InfoboxBuilderWrapperComponent = Em.Component.extend({
	layout: Em.computed(function() {
		var templates = this.get('templates'),
			templateText = templates['wrapper'];

		return Em.Handlebars.compile(templateText);
	})
});
