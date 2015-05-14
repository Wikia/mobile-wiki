declare module Hoek {
	function applyToDefaults(defaults: any, options: any, isNullOverride?: boolean): any;
	function escapeHtml(str: string): string;
}

declare module 'hoek' {
	export = Hoek;
}
