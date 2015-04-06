/// <reference path="../app.ts" />

Em.Handlebars.registerBoundHelper('i18n', function () {
	var options = Array.prototype.pop.call(arguments),
		params: {
			[key: string]: string;
		} = {},
		value: string,
		namespace = 'main';

	if (arguments.length > 1) {
		value = Array.prototype.join.call(arguments, '.');
	} else {
		value = arguments[0];
	}

	Object.keys(options.hash).forEach((key: string) => {
		if (key === 'ns') {
			namespace = options.hash[key];
		} else if (key !== 'boundOptions' && options.hash[key]) {
			params[key] = this.get(String(options.hash[key]));
		}
	});

	return i18n.t(namespace + ':' + value, params);
});
