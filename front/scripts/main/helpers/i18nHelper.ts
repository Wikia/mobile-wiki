/// <reference path="../app.ts" />

Em.Handlebars.registerBoundHelper('i18n', function (value: string, options: any) {
	var params: {
			[key: string]: string;
		} = {},
		namespace = 'app';

	Object.keys(options.hash).forEach((key: string) => {
		if (key === 'ns') {
			namespace = options.hash[key];
		} else if (key !== 'boundOptions' && options.hash[key]) {
			params[key] = this.get(String(options.hash[key]));
		}
	});

	return i18n.t(namespace + ':' + value, params);
});
