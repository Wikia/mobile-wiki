/// <reference path="../app.ts" />
/// <reference path="../../baseline/init.ts" />

/**
 * Helper to copy SVGs into the markup:
 * {{svg-copy name viewBox classes}}
 *
 * Generates output like:
 * <svg viewBox="0 0 12 7" class="icon chevron">
 * 	<Original SVG content>
 * </svg>
 */
App.SvgCopyHelper = Em.Helper.helper(function (params: any[], options: any): Em.Handlebars.SafeString {
	var optionalParams: string[] = [
			'class',
			'role',
			'viewBox'
		],
		ret = '<svg',
		name: string = params[0],
		content = document.getElementById(name).innerHTML;

	optionalParams.forEach(function (param: string): void {
		if (param in options) {
			ret += ` ${param}="${options[param]}"`;
		}
	});
	ret += `>${content}</svg>`;

	return new Em.Handlebars.SafeString(ret);
});
