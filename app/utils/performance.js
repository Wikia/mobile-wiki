import { getCLS, getFID, getLCP } from 'web-vitals';
import { system } from './browser';

/**
 * Report a given metric value to the metrics ingestion backend.
 * @param {string} baseUrl
 * @param {string} softwareVersion
 * @param {boolean} shouldSampleRequest
 * @returns {function(...[*]=)}
 */
const reportMetric = (
  baseUrl,
  softwareVersion,
  shouldSampleRequest,
) => ({ name, isFinal, value }) => {
  // Only send the metric value to the backend if it can't change
  // any more and we have chosen to sample this page load.
  if (!isFinal || !shouldSampleRequest) {
    return;
  }

  const time = Math.floor(Date.now() / 1000);

  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${baseUrl}&${name}=${value}&ut=${time}&os=${system}&m=mobile&v=${softwareVersion}`);
  } else {
    fetch(`${baseUrl}&${name}=${value}&ut=${time}&os=${system}&m=mobile&v=${softwareVersion}`, {
      method: 'POST',
      keepalive: true,
    });
  }
};

/**
 * Generate random number in given range
 * @param {number} min
 * @param {number} max
 * @returns {number}
 */
const randomInt = (min, max) => min + Math.floor((max - min) * Math.random());

/**
 * Initialize metrics gathering
 * @param {string} baseUrl
 * @param {string} softwareVersion
 * @param {number} sampleFactor
 */
export default (baseUrl, softwareVersion, sampleFactor) => {
  // Make a sampling decision whether to ingest metrics from this request.
  const shouldSampleRequest = randomInt(1, 99999999) % sampleFactor === 0;

  getCLS(reportMetric(baseUrl, softwareVersion, shouldSampleRequest));
  getFID(reportMetric(baseUrl, softwareVersion, shouldSampleRequest));
  getLCP(reportMetric(baseUrl, softwareVersion, shouldSampleRequest));
};
