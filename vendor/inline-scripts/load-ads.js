(function () {
  var getterAdsQueue = [];
  var adsLoaded = false;

  // TODO: Remove once we turn on AdEngine3 everywhere
  // This is temporary, simple method to check geo code
  // At this moment we don't have geo module from adProducts / mercury_ads_js
  function isProperGeo(countries) {
    try {
      var cookie = window.Cookies.get('Geo');
      var geo = JSON.parse(cookie) || {};

      return countries.indexOf(geo.country) !== -1 || countries.indexOf('XX') !== -1;
    } catch (e) {
      return false;
    }
  }

  function onAdsLoaded(adEngine3Loaded) {
    adsLoaded = true;

    getterAdsQueue.forEach(function (queuedCallback) {
      queuedCallback(adEngine3Loaded);
    });

    getterAdsQueue = [];
  }

  window.getInstantGlobals(function (instantGlobals) {
    var noExternalsSearchParam = (window.location.search.match(/noexternals=([a-z0-9]+)/i) || [])[1];

    if (
      instantGlobals.wgSitewideDisableAdsOnMercury
   || noExternalsSearchParam === '1'
   || noExternalsSearchParam === 'true'
    ) {
      return;
    }

    if (isProperGeo(instantGlobals.wgAdDriverAdEngine3Countries)) {
      var adsJsUrl = '/mobile-wiki-assets/assets/wikia-ae3/global-bundle.js';

      window.M.loadScript(adsJsUrl, true, function () {
        onAdsLoaded(true);
      });
    } else {
      var wikiVariables = window.M.getFromHeadDataStore('wikiVariables');
      var mercuryAdsJsUrl = wikiVariables.cdnRootUrl + '/__am/' + wikiVariables.cacheBuster
        + '/groups/-/mercury_ads_js';

      window.M.loadScript(mercuryAdsJsUrl, true, function () {
        onAdsLoaded(false);
      });
    }
  });

  window.waitForAds = function (callback) {
    if (adsLoaded) {
      callback();
    } else {
      getterAdsQueue.push(callback);
    }
  };
}());
