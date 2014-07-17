/// <reference path="../app.ts" />

/**
 * @define Helper that slices the array with var name 'path' in the context to the
 * specified size. Must use {{#with collection}}{{#each}} stuff you're doing {{/each}}{{/with}}
 */
Em.Handlebars.registerHelper('slice', function (path, size, options) {
	// Can't access the context directly because Ember.
	var collection = Em.Handlebars.get(this, path, options);
	var context = Ember.Object.create({
		collection: collection.slice(0, size)
	});
	return options.fn(context);
});
