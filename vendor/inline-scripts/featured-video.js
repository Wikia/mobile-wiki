(function () {
  var canPlayVideoFlag = null;

  function getCookieValue(cookieName) {
    var cookieSplit = ('; ' + document.cookie).split('; ' + cookieName + '=');

    return cookieSplit.length === 2 ? cookieSplit.pop().split(';').shift() : null;
  }

  function hasMaxedOutPlayerImpressionsPerSession() {
    var impressionsSoFar = Number(getCookieValue('playerImpressionsInSession')) || 0;
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

  window.canPlayVideo = function (refreshFlag) {
    if (canPlayVideoFlag === null || refreshFlag) {
      var isDedicatedForArticle = !!document.head.querySelector('[name="featured-video:is-dedicated-for-article"]');
      var allowedImpressionsMetaTag = document.head.querySelector('[name="featured-video:impressions-per-session"]');
      var hasVideo = isDedicatedForArticle || allowedImpressionsMetaTag;

      canPlayVideoFlag = hasVideo && (isDedicatedForArticle || !hasMaxedOutPlayerImpressionsPerSession());
    }

    return canPlayVideoFlag;
  };

  if (!window.canPlayVideo()) {
    document.body.classList.add('no-featured-video');
  }

})();
