/// <reference path="../app.ts" />

App.I18nHelper = Em.Helper.helper(function (params: any[], options: any): string {
	var i18nParams: {
			[key: string]: string;
		} = {},
		value: string,
		namespace: string = 'main';

	if (params.length > 1) {
		value = Array.prototype.join.call(params, '.');
	} else {
		value = params[0];
	}

	Object.keys(options).forEach((key: string): void => {
		if (key === 'ns') {
			namespace = options[key];
		} else if (key !== 'boundOptions' && options.hasOwnProperty(key)) {
			i18nParams[key] = String(options[key]);
		}
	});

	return i18n.t(namespace + ':' + value, i18nParams);
});
