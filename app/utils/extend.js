function deepExtend(out) {
	out = out || {};
	let i, key, obj;

	for (i = 1; i < arguments.length; i++) {
		obj = arguments[i];

		if (obj) {
			for (key in obj) {
				if (obj.hasOwnProperty(key)) {
					if (typeof obj[key] === 'object') {
						out[key] = deepExtend(out[key], obj[key]);
					} else {
						out[key] = obj[key];
					}
				}
			}
		}
	}

	return out;
}

export default function () {
	if (typeof FastBoot !== 'undefined') {
		return FastBoot.require('deep-extend')(...arguments);
	} else {
		return deepExtend(...arguments);
	}
}
