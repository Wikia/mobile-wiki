/// <reference path="../app.ts" />

App.I18nHelper = Em.Helper.helper(function (params: any[], options: any): string {
	var i18nParams: {
			[key: string]: string;
		} = {},
		value: string = params.join('.'),
		namespace = 'main';

	Object.keys(options).forEach((key: string): void => {
		if (key === 'ns') {
			namespace = options[key];
		} else if (key !== 'boundOptions' && options.hasOwnProperty(key)) {
			i18nParams[key] = String(options[key]);
		}
	});

	return i18n.t(`${namespace}:${value}`, i18nParams);
});
