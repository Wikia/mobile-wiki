/// <reference path="../index.ts" />

module Wikia {
	export module utils {
		export function extend(target, obj) {
			var key;

			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					target[key] = obj[key];
				}
			}

			return target;
		}
	}
}
