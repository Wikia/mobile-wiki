define('mobile-wiki/helpers/time-ago', ['exports', 'moment'], function (exports, _moment) {
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
		i18n: Ember.inject.service(),
		onLocaleChange: Ember.observer('momentLocale.isLoaded', function () {
			this.recompute();
		}),

		compute: function compute(_ref) {
			var _ref2 = _slicedToArray(_ref, 2),
			    unixTimestamp = _ref2[0],
			    _ref2$ = _ref2[1],
			    shouldHideAgoPrefix = _ref2$ === undefined ? true : _ref2$;

			var date = _moment.default.unix(unixTimestamp),
			    now = (0, _moment.default)(),
			    momentLocaleService = this.get('momentLocale');
			var output = void 0;

			if (!momentLocaleService.get('isLoaded')) {
				momentLocaleService.loadLocale();
				return new Ember.String.htmlSafe('<span class="date-placeholder"></span>');
			} else {
				if (now.diff(date, 'days') > 5) {
					output = date.format('L');
				} else if (now.diff(date, 'minutes') < 1) {
					output = this.get('i18n').t('main:app.now-label');
				} else {
					output = date.fromNow(shouldHideAgoPrefix);
				}
				return output;
			}
		}
	});
});