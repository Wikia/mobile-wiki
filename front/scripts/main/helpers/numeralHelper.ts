/// <reference path="../app.ts" />
/// <reference path="../../../../typings/numeraljs/numeraljs.d.ts" />

App.NumeralHelper = Em.Helper.helper(function (params: any[]): string {
	var numberToFormat = params[0],
		format = params[1];
	return numeral(numberToFormat).format(format);
});
