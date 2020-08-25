import { getCLS, getFID, getLCP, getFCP, getTTFB } from 'web-vitals';
import { createApiReporter, getDeviceInfo } from 'web-vitals-reporter';
import { system } from './browser';

const getCountryCode = () => {
  try {
    const cookieSplit = ('; ' + document.cookie).split('; Geo=');
    const cookieValue = cookieSplit.length === 2 ? cookieSplit.pop().split(';').shift() : null;
    if (cookieValue) {
      return JSON.parse(decodeURIComponent(cookieValue)).country;
    }
  } catch(e) {};
  return '';
};

/**
 * Get an object with low level performance and navigation metrics.
 * Keys:
 *  'DI' - dom interactive
 *  'DCL' - dom content loaded
 *  'DC' - dom complete
 *  'L' - page load time
 *  'DBS' - total resources size, decoded, both from HTTP or cache
 *  'EBS' - total encoded resources size, both from HTTP or cache
 *  'TS' - total size of headers and payloads transferred over HTTP
 */
function getLowLevelMetrics() {
  const r = {};
  const perfNav = window.performance.getEntriesByType('navigation');
  if (perfNav.length > 0) {
    r.DC = Math.round(perfNav[0].domComplete);
    r.DI = Math.round(perfNav[0].domInteractive);
    r.DCL = Math.round(perfNav[0].domContentLoadedEventEnd);
    r.L = Math.round(perfNav[0].loadEventEnd);
  }
  const perfRes = window.performance.getEntriesByType('resource');
  if (perfRes.length > 0) {
    r.DBS = 0; // decoded body size
    r.EBS = 0; // encoded body size
    r.TS = 0; // transfer size
    perfRes.forEach((performanceEntry, i, entries) => {
      if ('decodedBodySize' in performanceEntry) {
        r.DBS += performanceEntry.decodedBodySize;
      }
      if ('encodedBodySize' in performanceEntry) {
        r.EBS += performanceEntry.encodedBodySize;
      }
      if ('transferSize' in performanceEntry) {
        r.TS += performanceEntry.transferSize;
      }
    });
  }
  return r;
}

/**
 * Generate random number in given range
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const randomInt = (min, max) => min + Math.floor((max - min) * Math.random());

// This is an SPA, make sure we register the listener only on the first page load
let initDone = false;

/**
 * Initialize metrics gathering
 * @param {string} baseUrl
 * @param {string} softwareVersion
 * @param {number} sampleFactor
 */
export default (baseUrl, softwareVersion, sampleFactor) => {
  // Make a sampling decision whether to ingest metrics from this request.
  const shouldSampleRequest = randomInt(1, 99999999) % sampleFactor === 0;

  window.console.log('PPP ' + baseUrl);
  window.console.log(getCountryCode());
  if (shouldSampleRequest && !initDone) {
    initDone = true;
    console.log('WILL SAMPLE REQUEST');
    const initial = getDeviceInfo();
    initial.country = getCountryCode();
    initial.softwareVersion = softwareVersion;
    const sendToAnalytics = createApiReporter(baseUrl, {
      initial,
      onSend: (baseUrl, result) => {
        const time = Math.floor(Date.now() / 1000);
        let url = `${baseUrl}&ut=${time}&v=${result.softwareVersion}&os=${system}&m=mobile&g=${result.country}`;
        // Add basic network info
        if (result.connection) {
          url += `&c=${result.connection.effectiveType}&r=${result.connection.rtt}`;
        }
        // Add core vitals metrics
        const vitalsMetrics = ['CLS', 'FID', 'LCP', 'FCP', 'TTFB'];
        for (const m of vitalsMetrics) {
          if (result[m]) url += `&${m}=${result[m]}`;
        }
        // Add session duration
        if (result.duration) {
          url += `&sd=${result.duration}`;
        }

        // Add low-level performance metrics
        if (window.performance) {
          url +=
            '&' +
            Object.entries(getLowLevelMetrics())
              .map((p) => p.map(encodeURIComponent).join('='))
              .join('&');
        }
        // Send the performance info
        if (navigator.sendBeacon) {
          navigator.sendBeacon(url);
        } else {
          fetch(url, {
            method: 'POST',
            keepalive: true,
            credentials: 'omit',
            mode: 'no-cors',
          });
        }
      },
    });

    getCLS(sendToAnalytics);
    getFID(sendToAnalytics);
    getLCP(sendToAnalytics);
    getFCP(sendToAnalytics);
    getTTFB(sendToAnalytics);
  }
};
