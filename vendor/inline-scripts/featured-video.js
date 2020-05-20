(function () {
  var hasVideoOnPage = null;

  function getCookieValue(cookieName) {
    var cookieSplit = ('; ' + document.cookie).split('; ' + cookieName + '=');

    return cookieSplit.length === 2 ? cookieSplit.pop().split(';').shift() : null;
  }

  function hasMaxedOutPlayerImpressionsPerSession() {
    var impressionsSoFar = Number(getCookieValue('playerImpressionsInWiki')) || 0;
    var allowedImpressionsMetaTag = document.head.querySelector('[name="featured-video:impressions-per-session"]');
    var allowedImpressions = allowedImpressionsMetaTag ? Number(allowedImpressionsMetaTag.getAttribute('content')) : 1;

    if (!hasSeenTheVideoInCurrentSession()) {
      return false;
    }

    if (allowedImpressions === 0) {
      return true;
    }

    return impressionsSoFar >= allowedImpressions;
  }

  function hasSeenTheVideoInCurrentSession() {
    var currentSession = getCookieValue('wikia_session_id');
    var videoSeenInSession = getCookieValue('featuredVideoSeenInSession');

    return currentSession && videoSeenInSession && currentSession === videoSeenInSession;
  }

  function getCountryCode() {
    try {
      return JSON.parse(decodeURIComponent(getCookieValue('Geo'))).country.toLowerCase();
    } catch(e) {
      return null;
    }
  }

  function isVideoBridgeAllowedForCountry(videoBridgeCountries) {
    var countryCode = getCountryCode();
    var allowedCountries = videoBridgeCountries.map(function (allowedCountryCode) {
      return allowedCountryCode.toLowerCase();
    });

    return countryCode && allowedCountries.indexOf(countryCode) !== -1;
  }

  window.canPlayVideo = function (refreshFlag) {
    if (hasVideoOnPage === null || refreshFlag) {
      var isDedicatedForArticle = !!document.head.querySelector('[name="featured-video:is-dedicated-for-article"]');
      var allowedImpressionsMetaTag = document.head.querySelector('[name="featured-video:impressions-per-session"]');
      var hasVideo = isDedicatedForArticle || allowedImpressionsMetaTag;
      var videoBridgeCountriesMetaTag = document.head.querySelector('[name="featured-video:video-bridge-countries"]');
      var videoBridgeCountries;

      if (videoBridgeCountriesMetaTag) {
        try {
          videoBridgeCountries = JSON.parse(videoBridgeCountriesMetaTag.getAttribute('content'));
        } catch (e) {
          videoBridgeCountries = [];
        }
      }

      hasVideoOnPage = hasVideo && (isDedicatedForArticle ||
        (!hasMaxedOutPlayerImpressionsPerSession() && isVideoBridgeAllowedForCountry(videoBridgeCountries))
      );
    }

    return hasVideoOnPage;
  };

  if (!window.canPlayVideo()) {
    document.body.classList.add('no-featured-video');
  }

})();
