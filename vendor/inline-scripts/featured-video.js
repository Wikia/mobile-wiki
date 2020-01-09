(function () {
  function getCookieValue(cookieName) {
    var cookieSplit = ('; ' + document.cookie).split('; ' + cookieName + '=');

    return cookieSplit.length === 2 ? cookieSplit.pop().split(';').shift() : null;
  }

  function hasMaxedOutPlayerImpressionsPerSession() {
    var impressionsSoFar = Number(getCookieValue('playerImpressionsInSession')) || 0;
    var allowedImpressionsMetaTag = document.head.querySelector('[name="player-impressions-per-session"]');
    var allowedImpressions = allowedImpressionsMetaTag ? Number(allowedImpressionsMetaTag.getAttribute('content')) : 1;

    return !hasSeenTheVideoInCurrentSession() || (allowedImpressions && impressionsSoFar < allowedImpressions);
  }

  function hasSeenTheVideoInCurrentSession() {
    var currentSession = getCookieValue('wikia_session_id');
    var videoSeenInSession = getCookieValue('featuredVideoSeenInSession');

    return currentSession && videoSeenInSession && currentSession === videoSeenInSession;
  }

  window.canPlayVideo = function () {
    var isDedicatedForArticle = !!document.head.querySelector('[name="featured-video"]');

    if (!isDedicatedForArticle) {
      return hasMaxedOutPlayerImpressionsPerSession();
    }

    return true;
  };

  if (!window.canPlayVideo()) {
    document.body.classList.add('no-featured-video');
  }

})();
