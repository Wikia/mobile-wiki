/// <reference path="../app.ts" />

/**
 * @define Helper that slices an array to specified size.
 * @param path the name of the array in the context
 * @param size what we want to slice it to
 * @options hbs options
 * Usage:
 * {{#slice arr 45}}
 * 	{{#with collection}}
 * 		{{#each}}
 * 			stuff you're doing, perhaps accessing {{unbound property}} within objects
 * 		{{/each}}
 * 	{{/with}}
 * {{/slice}}
 */
Em.Handlebars.registerHelper('slice', function (path, size, options) {
	// Can't access the context directly because Ember.
	var collection = Em.Handlebars.get(this, path, options);
	var context = Ember.Object.create({
		collection: collection.slice(0, size)
	});
	return options.fn(context);
});
