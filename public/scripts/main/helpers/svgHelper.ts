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
Em.Handlebars.registerHelper('svg', function (name: string, viewBox?: string, classes?: string) {
	var ret = '<svg';
	if (viewBox) {
		ret += ' viewBox="' + viewBox + '"'
	}
	if (classes) {
		ret += ' class="' + classes + '"';
	}
	ret += '><use xlink:href="#' + name + '"></use></svg>';
	return new Em.Handlebars.SafeString(ret);
});
