/// <reference path="../app.ts" />
/// <reference path="../../../../typings/numeraljs/numeraljs.d.ts" />

Em.Handlebars.registerBoundHelper('numeral', function (numberToFormat: number, format: string): string {
	return numeral(numberToFormat).format(format);
});
