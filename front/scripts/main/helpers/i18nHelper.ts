/// <reference path="../app.ts" />

Em.Handlebars.registerBoundHelper('i18n', function () {
var options = arguments[arguments.length - 1],
	args = Array.prototype.slice.apply(arguments, [0, -1]),
	params: {
		[key: string]: string;
	} = {},
	value: string,
	namespace = 'main';

	if (args.length > 1) {
		value = args.join('.');
	} else {
		value = args[0];
	}

	Object.keys(options.hash).forEach((key: string) => {
		if (key === 'ns') {
			namespace = options.hash[key];
		} else if (key !== 'delimiter' && key !== 'boundOptions' && options.hash[key]) {
			params[key] = this.get(String(options.hash[key]));
		}
	});

	return i18n.t(namespace + ':' + value, params);
});
