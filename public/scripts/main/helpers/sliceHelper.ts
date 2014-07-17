/// <reference path="../app.ts" />

Ember.Handlebars.registerBoundHelper("slice", function(collection, options) {

	var size = options.hash.size || 5;

	options.fn(Ember.Object.create({
		collection: collection.slice(0, size)
	}));

});
