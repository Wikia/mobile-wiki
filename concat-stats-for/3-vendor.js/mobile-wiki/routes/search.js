define('mobile-wiki/routes/search', ['exports', 'mobile-wiki/mixins/application-wrapper-class-names', 'mobile-wiki/models/search', 'mobile-wiki/utils/track'], function (exports, _applicationWrapperClassNames, _search, _track) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var Route = Ember.Route;
	var getOwner = Ember.getOwner;
	exports.default = Route.extend(_applicationWrapperClassNames.default, {
		applicationWrapperClassNames: ['search-result-page'],
		queryParams: {
			query: {
				refreshModel: true
			}
		},

		initialPageView: service(),

		model: function model(params) {
			return _search.default.create(getOwner(this).ownerInjection()).search(params.query);
		},


		actions: {
			/**
    * @returns {boolean}
    */
			didTransition: function didTransition() {
				(0, _track.trackPageView)(this.get('initialPageView').isInitialPageView());

				(0, _track.track)({
					action: _track.trackActions.impression,
					category: 'app',
					label: 'search'
				});

				return true;
			}
		}
	});
});