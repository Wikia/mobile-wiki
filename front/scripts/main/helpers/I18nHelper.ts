/// <reference path="../app.ts" />

App.I18nHelper = Em.Helper.helper(function (): string {
	var options = Array.prototype.pop.call(arguments),
		params: {
			[key: string]: string;
		} = {},
		value: string,
		namespace = 'main',
		segments = arguments[0];

	if (segments.length > 1) {
		value = Array.prototype.join.call(segments, '.');
	} else {
		value = segments[0];
	}

	Object.keys(options).forEach((key: string): void => {
		if (key === 'ns') {
			namespace = options[key];
		} else if (key !== 'boundOptions' && options.hasOwnProperty(key)) {
			params[key] = String(options[key]);
		}
	});

	return i18n.t(namespace + ':' + value, params);
});
