/// <reference path="../../baseline/Wikia.d.ts" />

module Wikia.Utils {
	export function extend(target: any, obj: any) {
		Object.keys(obj).forEach((key) => {
			target[key] = obj[key];
		});

		return target;
	}
}
