define("mobile-wiki/modules/instant-globals", ["exports"], function (exports) {
	"use strict";

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	function _classCallCheck(instance, Constructor) {
		if (!(instance instanceof Constructor)) {
			throw new TypeError("Cannot call a class as a function");
		}
	}

	var _createClass = function () {
		function defineProperties(target, props) {
			for (var i = 0; i < props.length; i++) {
				var descriptor = props[i];
				descriptor.enumerable = descriptor.enumerable || false;
				descriptor.configurable = true;
				if ("value" in descriptor) descriptor.writable = true;
				Object.defineProperty(target, descriptor.key, descriptor);
			}
		}

		return function (Constructor, protoProps, staticProps) {
			if (protoProps) defineProperties(Constructor.prototype, protoProps);
			if (staticProps) defineProperties(Constructor, staticProps);
			return Constructor;
		};
	}();

	var InstantGlobals = function () {
		function InstantGlobals() {
			_classCallCheck(this, InstantGlobals);
		}

		_createClass(InstantGlobals, null, [{
			key: "get",
			value: function get(key) {
				if (window.Wikia && window.Wikia.InstantGlobals) {
					return window.Wikia.InstantGlobals[key];
				}
			}
		}]);

		return InstantGlobals;
	}();

	exports.default = InstantGlobals;
});