/// <reference path="../app.ts" />
/// <reference path="../../baseline/init.ts" />

/**
 * @desc Helper to generate SVGs in the form:
 * {{svg name viewBox classes}}
 * <svg viewBox="{{viewBox}}" class="{{classes}}">
 * 	<use xlink:href="#{{name}}"></use>
 * </svg>
 *
 * i.e., {{svg "chevron" "0 0 12 7" "icon chevron"}} generates:
 * <svg viewBox="0 0 12 7" class="icon chevron">
 * 	<use xlink:href="#chevron"></use>
 * </svg>
 */
App.SvgHelper = Em.Helper.helper(function (params: any[], options: any): Em.Handlebars.SafeString {
	var optionalParams: string[] = [
			'class',
			'role',
			'viewBox'
		],
		ret = '<svg',
		name: string = params[0];

	optionalParams.forEach(function (param: string): void {
		if (param in options) {
			ret += ` ${param}="${options[param]}"`;
		}
	});
	ret += `><use xlink:href="#${name}"></use></svg>`;

	return new Em.Handlebars.SafeString(ret);
});
