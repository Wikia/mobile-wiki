(function () {
  function getCookieValue(cookieName) {
    var cookieSplit = ('; ' + document.cookie).split('; ' + cookieName + '=');

    return cookieSplit.length === 2 ? cookieSplit.pop().split(';').shift() : null;
  }

  window.canPlayVideo = function () {
    return document.head.querySelector('[name="featured-video"]')
      || getCookieValue('wikia_session_id') !== getCookieValue('featuredVideoSeenInSession')
  };

  if (!window.canPlayVideo()) {
    document.body.classList.add('no-featured-video');
  }
})();
