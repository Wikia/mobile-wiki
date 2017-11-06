define('mobile-wiki/mirage/serializers/curated-content-section', ['exports', 'mobile-wiki/mirage/serializers/application'], function (exports, _application) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _application.default.extend({
		serialize: function serialize(_ref) {
			var attrs = _ref.attrs;

			return attrs;
		}
	});
});