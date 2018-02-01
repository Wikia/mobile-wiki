import deepExtend from 'deep-extend';

// We can't use Object.assign because it's not doing deep merge
export default function () {
	return deepExtend(...arguments);
}
