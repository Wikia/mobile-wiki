(function pageViewTracking(config = {}) {
  let beacon;
  let sessionId;
  let pvNumber;
  let pvNumberGlobal;
  let headData;

  function readCookies() {
    beacon = getCookieValue('wikia_beacon_id');
    sessionId = getCookieValue('tracking_session_id') || genUID();
    pvNumber = getCookieValue('pv_number') || 0;
    pvNumberGlobal = getCookieValue('pv_number_global') || 0;
  }

  function getCookieValue(cookieName) {
    const cookieSplit = ('; ' + document.cookie).split('; ' + cookieName + '=');

    return cookieSplit.length === 2 ? cookieSplit.pop().split(';').shift() : null;
  }

  function genUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);

      return v.toString(16);
    });
  }

  function getEventParams(shouldIncreasePvNumber) {
    let pvNumberComputed = pvNumber ? parseInt(pvNumber, 10) : 0;
    let pvNumberGlobalComputed = pvNumberGlobal ? parseInt(pvNumberGlobal, 10) : 0;
    if (shouldIncreasePvNumber || !window.fandomTrackingCookiesSet) {
      pvNumberComputed += 1;
      pvNumberGlobalComputed += 1;
    }

    const params = {
      beacon: beacon,
      cb: new Date().valueOf(),
      session_id: sessionId,
      pv_unique_id: genUID(),
      pv_number: pvNumberComputed,
      pv_number_global: pvNumberGlobalComputed,
      url: window.location.href,
      c: headData.wikiVariables.id,
      a: headData.trackingDimensions[21],
      lc: headData.wikiVariables.language.content,
      x: headData.wikiVariables.dbName,
      s: 'mercury',
      n: headData.trackingDimensions[25],
    };

    if (document.referrer) {
      params.r = encodeURIComponent(document.referrer);
    }

    return params;
  }

  function setCookies() {
    if (!getCookieValue('tracking_session_id')) {
      const expireDate = new Date(Date.now() + 1000 * 60 * 30);

      document.cookie = 'tracking_session_id=' + sessionId + '; expires=' + expireDate.toGMTString() +
        ';domain=' + config.wgCookieDomain + '; path=' + config.wgCookiePath + ';';
    }
  }

  function readData() {
    try {
      headData = JSON.parse(document.querySelector('#head-data-store').innerHTML);
    } catch(e) {
    }
  }

  function track(shouldIncreasePvNumber) {
    const requestUrl = 'https://beacon.wikia-services.com/__track/special/fcp_pageview';

    if(!headData) {
      readData();
    }
    readCookies();
    setCookies();

    const params = getEventParams(shouldIncreasePvNumber);
    const queryParams = Object.keys(params)
    .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&');

    fetch(`${requestUrl}?${queryParams}`, { mode: 'no-cors', keepalive: true });
  }

  window.fandomFCPtrackPageView = function (shouldIncreasePvNumber = true) {
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        track(shouldIncreasePvNumber);
      });
    });
  }

  window.fandomFCPtrackPageView();
})();
