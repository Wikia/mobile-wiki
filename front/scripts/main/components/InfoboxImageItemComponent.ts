/// <reference path="../app.ts" />
'use strict';

App.InfoboxImageItemComponent = Em.Component.extend({
	url: 'https://upload.wikimedia.org/wikipedia/en/6/62/Kermit_the_Frog.jpg',

	layout: Em.computed(function() {
		var templates = this.get('templates'),
			templateText = templates['image'];

		//return Em.Handlebars.compile(templateText);
	})
});
