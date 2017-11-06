define('mobile-wiki/utils/errors', ['exports', 'ember-exex/error'], function (exports, _error) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.WikiVariablesFetchError = exports.WikiPageFetchError = exports.TrackingDimensionsFetchError = exports.UserLoadInfoFetchError = exports.UserLoadDetailsFetchError = exports.WikiVariablesRedirectError = exports.FandomPostsError = exports.DontLogMeError = exports.DesignSystemFetchError = exports.getFetchErrorMessage = undefined;


	var DesignSystemFetchError = (0, _error.defineError)({
		name: 'DesignSystemFetchError',
		message: 'Design System data couldn\'t be fetched'
	});

	var DontLogMeError = (0, _error.defineError)({
		name: 'DontLogMeError',
		message: 'Hack: this error was created only to stop executing Ember and redirect immediately'
	});

	var FandomPostsError = (0, _error.defineError)({
		name: 'FandomPostsError',
		message: 'Fandom posts couldn\'t be fetched'
	});

	var WikiVariablesRedirectError = (0, _error.defineError)({
		name: 'WikiVariablesRedirectError',
		message: 'The API response was in incorrect format',
		extends: DontLogMeError
	});

	var UserLoadDetailsFetchError = (0, _error.defineError)({
		name: 'UserLoadDetailsFetchError',
		message: 'User details couldn\'t be fetched'
	});

	var UserLoadInfoFetchError = (0, _error.defineError)({
		name: 'UserLoadInfoFetchError',
		message: 'User info couldn\'t be fetched'
	});

	var TrackingDimensionsFetchError = (0, _error.defineError)({
		name: 'TrackingDimensionsFetchError',
		message: 'Tracking dimensions couldn\'t be fetched'
	});

	var WikiPageFetchError = (0, _error.defineError)({
		name: 'WikiPageFetchError',
		message: 'Wiki page couldn\'t be fetched'
	});

	var WikiVariablesFetchError = (0, _error.defineError)({
		name: 'WikiVariablesFetchError',
		message: 'Wiki variables couldn\'t be fetched'
	});

	var getFetchErrorMessage = function getFetchErrorMessage(response) {
		var contentType = response.headers.get('content-type');

		if (contentType && contentType.indexOf('application/json') !== -1) {
			return response.json();
		} else {
			return response.text();
		}
	};

	exports.getFetchErrorMessage = getFetchErrorMessage;
	exports.DesignSystemFetchError = DesignSystemFetchError;
	exports.DontLogMeError = DontLogMeError;
	exports.FandomPostsError = FandomPostsError;
	exports.WikiVariablesRedirectError = WikiVariablesRedirectError;
	exports.UserLoadDetailsFetchError = UserLoadDetailsFetchError;
	exports.UserLoadInfoFetchError = UserLoadInfoFetchError;
	exports.TrackingDimensionsFetchError = TrackingDimensionsFetchError;
	exports.WikiPageFetchError = WikiPageFetchError;
	exports.WikiVariablesFetchError = WikiVariablesFetchError;
});