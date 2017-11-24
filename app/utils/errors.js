import {defineError} from 'ember-exex/error';

const errorsMap = {
	'403': 'You do not have permissions to view this page.'	,
	default: 'Sorry, we couldn\'t load the page. Please try again.'
};

const DesignSystemFetchError = defineError({
	name: 'DesignSystemFetchError',
	message: `Design System data couldn't be fetched`
});

const DontLogMeError = defineError({
	name: 'DontLogMeError',
	message: `Hack: this error was created only to stop executing Ember and redirect immediately`
});

const FandomPostsError = defineError({
	name: 'FandomPostsError',
	message: `Fandom posts couldn't be fetched`
});

const WikiVariablesRedirectError = defineError({
	name: 'WikiVariablesRedirectError',
	message: `The API response was in incorrect format`,
	extends: DontLogMeError
});

const UserLoadDetailsFetchError = defineError({
	name: 'UserLoadDetailsFetchError',
	message: `User details couldn't be fetched`
});

const UserLoadInfoFetchError = defineError({
	name: 'UserLoadInfoFetchError',
	message: `User info couldn't be fetched`
});

const TrackingDimensionsFetchError = defineError({
	name: 'TrackingDimensionsFetchError',
	message: `Tracking dimensions couldn't be fetched`
});

const WikiPageFetchError = defineError({
	name: 'WikiPageFetchError',
	message: `Wiki page couldn't be fetched`
});

const WikiVariablesFetchError = defineError({
	name: 'WikiVariablesFetchError',
	message: `Wiki variables couldn't be fetched`
});

const getFetchErrorMessage = function (response) {
	const contentType = response.headers.get('content-type');

	if (contentType && contentType.indexOf('application/json') !== -1) {
		return response.json();
	} else {
		return response.text();
	}
};

const canAttemptRefresh = function (errorCode) {
	return typeof errorCode === 'number' && errorCode >= 500;
};

const getProductionErrorMessage = function (errorCode) {
	return errorsMap[errorCode] || errorsMap.default;
};

export {
	getFetchErrorMessage,
	DesignSystemFetchError,
	DontLogMeError,
	FandomPostsError,
	WikiVariablesRedirectError,
	UserLoadDetailsFetchError,
	UserLoadInfoFetchError,
	TrackingDimensionsFetchError,
	WikiPageFetchError,
	WikiVariablesFetchError,
	canAttemptRefresh,
	getProductionErrorMessage
};
