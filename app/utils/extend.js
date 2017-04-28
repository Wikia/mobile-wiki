// We can't use Object.assign because it's not doing deep merge
export default function () {
	console.log('extend');
	console.log(...arguments);

	if (typeof FastBoot !== 'undefined') {
		return FastBoot.require('deep-extend')(...arguments);
	} else {
		return $.extend(true, ...arguments);
	}
}
