import {defineError} from 'ember-exex/error';

const WikiVariablesFetchError = defineError({
	name: 'WikiVariablesFetchError',
	message: `Wiki variables couldn't be fetched`
});

const DesignSystemFetchError = defineError({
	name: 'DesignSystemFetchError',
	message: `Design System data couldn't be fetched`
});

const DontLogMeError = defineError({
	name: 'DontLogMeError',
	message: `Hack: this error was created only to stop executing Ember and redirect immediately`
});

const NonJsonApiResponseError = defineError({
	name: 'NonJsonApiResponseError',
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

export {
	WikiVariablesFetchError,
	DesignSystemFetchError,
	DontLogMeError,
	NonJsonApiResponseError,
	UserLoadDetailsFetchError,
	UserLoadInfoFetchError,
	TrackingDimensionsFetchError
};
