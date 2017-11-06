define('mobile-wiki/utils/extend', ['exports'], function (exports) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	exports.default = function () {
		if (typeof FastBoot !== 'undefined') {
			return FastBoot.require('deep-extend').apply(undefined, arguments);
		} else {
			var _$;

			return (_$ = $).extend.apply(_$, [true].concat(Array.prototype.slice.call(arguments)));
		}
	};
});