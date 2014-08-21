/// <reference path="../app.ts" />

Em.Handlebars.registerBoundHelper('i18n', function(value: string, options: any) {
	var params: {
			[key: string]: string;
		} = {},
		self = this,
		namespace = 'app';

	Object.keys(options.hash).forEach(function(key: string) {
		if (key === 'ns') {
			namespace = options.hash[key];
		} else if (key !== 'boundOptions' && options.hash[key]) {
			params[key] = Em.Handlebars.get(self, String(options.hash[key]), options);
		}
	});

	return i18n.t(namespace + ':' + value, params);
});
