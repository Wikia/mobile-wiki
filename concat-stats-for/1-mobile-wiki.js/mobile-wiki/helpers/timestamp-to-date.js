define('mobile-wiki/helpers/timestamp-to-date', ['exports', 'moment'], function (exports, _moment) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});

	var _slicedToArray = function () {
		function sliceIterator(arr, i) {
			var _arr = [];
			var _n = true;
			var _d = false;
			var _e = undefined;

			try {
				for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
					_arr.push(_s.value);

					if (i && _arr.length === i) break;
				}
			} catch (err) {
				_d = true;
				_e = err;
			} finally {
				try {
					if (!_n && _i["return"]) _i["return"]();
				} finally {
					if (_d) throw _e;
				}
			}

			return _arr;
		}

		return function (arr, i) {
			if (Array.isArray(arr)) {
				return arr;
			} else if (Symbol.iterator in Object(arr)) {
				return sliceIterator(arr, i);
			} else {
				throw new TypeError("Invalid attempt to destructure non-iterable instance");
			}
		};
	}();

	exports.default = Ember.Helper.extend({
		momentLocale: Ember.inject.service(),
		onLocaleChange: Ember.observer('momentLocale.isLoaded', function () {
			this.recompute();
		}),

		compute: function compute(_ref) {
			var _ref2 = _slicedToArray(_ref, 2),
			    unixTimestamp = _ref2[0],
			    _ref2$ = _ref2[1],
			    dateFormat = _ref2$ === undefined ? 'LLLL' : _ref2$;

			var momentLocaleService = this.get('momentLocale');

			if (momentLocaleService.get('isLoaded')) {
				return _moment.default.unix(unixTimestamp).format(dateFormat);
			} else {
				momentLocaleService.loadLocale();
			}
		}
	});
});