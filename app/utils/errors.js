import { defineError } from 'ember-exex/error';

// TODO remove redundant errors from this file and use ones from ember-fandom across app
import { DontLogMeError } from '@wikia/ember-fandom/utils/errors';

const errorsMap = {
  403: 'You do not have permissions to view this page.',
  default: 'Sorry, we couldn\'t load the page. Please try again.',
};

const ArticleCommentsFetchError = defineError({
  name: 'ArticleCommentsFetchError',
  message: 'Article Comments data couldn\'t be fetched',
});

const CategoryMembersFetchError = defineError({
  name: 'CategoryMembersFetchError',
  message: 'Category Members data couldn\'t be fetched',
});

const DesignSystemFetchError = defineError({
  name: 'DesignSystemFetchError',
  message: 'Design System data couldn\'t be fetched',
});

const FetchError = defineError({
  name: 'FetchError',
  message: 'fetch failed to execute',
});

const FandomPostsError = defineError({
  name: 'FandomPostsError',
  message: 'Fandom posts couldn\'t be fetched',
});

const WikiVariablesRedirectError = defineError({
  name: 'WikiVariablesRedirectError',
  message: 'The API response was in incorrect format',
  extends: DontLogMeError,
});

const UserLoadDetailsFetchError = defineError({
  name: 'UserLoadDetailsFetchError',
  message: 'User details couldn\'t be fetched',
});

const UserLoadInfoFetchError = defineError({
  name: 'UserLoadInfoFetchError',
  message: 'User info couldn\'t be fetched',
});

const TrackingDimensionsFetchError = defineError({
  name: 'TrackingDimensionsFetchError',
  message: 'Tracking dimensions couldn\'t be fetched',
});

const TopArticlesFetchError = defineError({
  name: 'TopArticlesFetchError',
  message: 'Top Articles couldn\'t be fetched',
});

const RecommendedDataFetchError = defineError({
  name: 'RecommendedDataFetchError',
  message: 'Recommended data couldn\'t be fetched',
});

const AffiliatesFetchError = defineError({
  name: 'AffiliatesFetchError',
  message: 'Affiliates data couldn\'t be fetched',
});

const WikiaInYourLangFetchError = defineError({
  name: 'WikiaInYourLangFetchError',
  message: 'WikiaInYourLang data couldn\'t be fetched',
});

const WikiIsClosedError = defineError({
  name: 'WikiIsClosedError',
  message: 'The current wiki is closed',
});

const WikiPageFetchError = defineError({
  name: 'WikiPageFetchError',
  message: 'Wiki page couldn\'t be fetched',
});

const WikiVariablesFetchError = defineError({
  name: 'WikiVariablesFetchError',
  message: 'Wiki variables couldn\'t be fetched',
});

const getFetchErrorMessage = function (response) {
  const contentType = response.headers.get('content-type');

  if (contentType && contentType.indexOf('application/json') !== -1) {
    return response.json();
  }
  return response.text();
};

const canAttemptRefresh = function (errorCode) {
  return typeof errorCode === 'number' && errorCode >= 500;
};

const getProductionErrorMessage = function (errorCode) {
  return errorsMap[errorCode] || errorsMap.default;
};

export {
  getFetchErrorMessage,
  ArticleCommentsFetchError,
  CategoryMembersFetchError,
  DesignSystemFetchError,
  FetchError,
  FandomPostsError,
  WikiVariablesRedirectError,
  UserLoadDetailsFetchError,
  UserLoadInfoFetchError,
  TrackingDimensionsFetchError,
  TopArticlesFetchError,
  RecommendedDataFetchError,
  WikiaInYourLangFetchError,
  WikiIsClosedError,
  WikiPageFetchError,
  WikiVariablesFetchError,
  canAttemptRefresh,
  getProductionErrorMessage,
  AffiliatesFetchError,
};
