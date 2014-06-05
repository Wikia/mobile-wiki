/// <reference path="../app.ts" />

Em.Handlebars.registerBoundHelper('i18n', function(value: string, options: any) {
	var params = {},
		self = this,
		namespace = 'app';

	Object.keys(options.hash).forEach(function(key: string) {
		if (key === 'namespace') {
			namespace = options.hash[key];
		} else if (key !== 'boundOptions') {
			params[key] = Em.Handlebars.get(self, options.hash[key], options);
		}
	});

	return App.get('i18n')(namespace + '.' + value, params);
}, App.Translations);
