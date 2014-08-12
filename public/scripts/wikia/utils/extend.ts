module Wikia.Utils {
	export function extend(target, obj) {
		Object.keys(obj).forEach((key) => {
			target[key] = obj[key];
		});

		return target;
	}
}
