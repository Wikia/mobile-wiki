/// <reference path='./mercury/utils/state.ts' />
interface Window {
	[key: string]: any;
}

module Mercury {}

// alias M for quick access to utility functions
var M: typeof Mercury.Utils = Mercury.Utils;
