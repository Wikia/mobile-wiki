/// <reference path="../../baseline/Wikia.ts" />

module Wikia.Utils {
	export function extend(target: any, obj: any): any {
		Object.keys(obj).forEach((key) => {
			target[key] = obj[key];
		});

		return target;
	}
}
