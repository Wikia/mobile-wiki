/// <reference path="../../../typings/jquery/jquery.d.ts" />

declare var $: JQueryStatic;
declare var require: (deps: string[], func: Function) => void;

declare module Mercury {
	var provide: (str: any, obj: any) => any;
	var article: any;
	var _state: {
		firstPage: boolean;
		translations: any;
		weppyConfig: any;
	};
	var error: any;
	var wiki: any;
	var apiBase: string;
	var tracking: any;
	var adsUrl: string;
	var environment: string;
}

declare var M: typeof Mercury.Utils;

interface Location {
	origin: string;
}
