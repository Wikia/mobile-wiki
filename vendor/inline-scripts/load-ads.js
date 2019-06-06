(function () {
  var adEngineQueue = [];

  function onAdsLoaded() {
    if (!window.Wikia || !window.Wikia.adEngine) {
      return;
    }

    window.Wikia.adEngine.utils.makeLazyQueue(adEngineQueue, function (cb) {
      cb();
    });
    adEngineQueue.start();
  }

  window.getInstantGlobals(function (instantGlobals) {
    var noExternalsSearchParam = (window.location.search.match(/noexternals=([a-z0-9]+)/i) || [])[1];
    var noExternals = noExternalsSearchParam === '1' || noExternalsSearchParam === 'true';

    if (instantGlobals.wgSitewideDisableAdsOnMercury || noExternals) {
      return;
    }

    var prebidJsUrl = '/mobile-wiki-assets/assets/wikia-ae3/prebid.min.js';

    window.M.loadScript(prebidJsUrl, true, onAdsLoaded);
  });

  window.waitForAds = function (callback) {
    adEngineQueue.push(callback);
  };
}());
