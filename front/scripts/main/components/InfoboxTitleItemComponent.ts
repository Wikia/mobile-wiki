/// <reference path="../app.ts" />
'use strict';

App.InfoboxTitleItemComponent = Em.Component.extend({
	value: Em.computed('data', function() {
		return this.get('data.defaultValue') || 'Your Title';
	}),

	layout: Em.computed(function() {
		var templates = this.get('templates'),
			templateText = templates['title'];

		return Em.Handlebars.compile(templateText);
	})
});
