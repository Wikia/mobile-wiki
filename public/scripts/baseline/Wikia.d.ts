/// <reference path="../../../typings/jquery/jquery.d.ts" />
/// <reference path="../../../typings/ember/ember.d.ts" />
declare var $: JQueryStatic;
declare var require: (deps: string[], func: Function) => void;

declare module Wikia {
	var provide: (str: any, obj: any) => any;
	var _t: any;
	var language: string;
	var article: any;
	var _state: any;
	var error: any;
	var wiki: any;
	var apiBase: string;
	var tracking: any;
	var adsUrl: string;
}

declare var W: typeof Wikia.Utils;

interface Location {
	origin: string;
}
