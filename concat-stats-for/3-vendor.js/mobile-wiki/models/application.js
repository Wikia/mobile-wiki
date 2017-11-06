define('mobile-wiki/models/application', ['exports', 'mobile-wiki/utils/host', 'mobile-wiki/models/user', 'mobile-wiki/models/navigation', 'mobile-wiki/models/wiki-variables', 'mobile-wiki/models/tracking-dimensions'], function (exports, _host, _user, _navigation, _wikiVariables, _trackingDimensions) {
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

	var EmberObject = Ember.Object,
	    RSVP = Ember.RSVP,
	    getOwner = Ember.getOwner,
	    inject = Ember.inject;
	exports.default = EmberObject.extend({
		currentUser: inject.service(),
		fastboot: inject.service(),
		logger: inject.service(),

		fetch: function fetch(title, uselangParam) {
			var currentUser = this.get('currentUser'),
			    fastboot = this.get('fastboot'),
			    shoebox = fastboot.get('shoebox');

			if (fastboot.get('isFastBoot')) {
				var host = (0, _host.default)(fastboot.get('request')),
				    accessToken = fastboot.get('request.cookies.access_token'),
				    ownerInjection = getOwner(this).ownerInjection();

				return RSVP.all([_wikiVariables.default.create(ownerInjection).fetch(host), _user.default.create(ownerInjection).getUserId(accessToken)]).then(function (_ref) {
					var _ref2 = _slicedToArray(_ref, 2),
					    wikiVariablesData = _ref2[0],
					    userId = _ref2[1];

					shoebox.put('userId', userId);

					return RSVP.hashSettled({
						currentUser: currentUser.initializeUserData(userId, host),
						navigation: _navigation.default.create(ownerInjection).fetchAll(host, wikiVariablesData.id, uselangParam || wikiVariablesData.language.content),
						trackingDimensions: _trackingDimensions.default.create(ownerInjection).fetch(!userId, host, title),
						wikiVariablesData: wikiVariablesData
					}).then(function (_ref3) {
						var navigation = _ref3.navigation,
						    wikiVariablesData = _ref3.wikiVariablesData,
						    trackingDimensions = _ref3.trackingDimensions;

						// We only want to fail application if we don't have the navigation data
						if (navigation.state === 'rejected') {
							throw navigation.reason;
						}

						var applicationData = {
							navigation: navigation.value,
							wikiVariables: wikiVariablesData.value
						};

						shoebox.put('applicationData', applicationData);

						if (trackingDimensions.state === 'fulfilled' && trackingDimensions.value.dimensions) {
							shoebox.put('trackingDimensionsForFirstPage', trackingDimensions.value.dimensions);
						}

						return applicationData;
					});
				});
			} else {
				currentUser.initializeUserData(shoebox.retrieve('userId'));

				return RSVP.resolve(shoebox.retrieve('applicationData'));
			}
		}
	});
});