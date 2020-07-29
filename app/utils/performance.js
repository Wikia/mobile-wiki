import { getCLS, getFID, getLCP } from 'web-vitals';
import { system } from './browser';

/**
 * Report a given metric value to the metrics ingestion backend.
 */
const reportMetric = (baseUrl, softwareVersion, shouldSampleRequest) => ({ name, isFinal, value }) => {
  // Only send the metric value to the backend if it can't change any more and we have chosen to sample this page load.
  if (!isFinal || !shouldSampleRequest) {
    return;
  }

  const time = Math.floor(Date.now() / 1000);
  const os = system;
  const device = 'mobile';

  if (navigator.sendBeacon) {
    navigator.sendBeacon(`${baseUrl}&${name}=${value}&ut=${time}&os=${os}&m=${device}&v=${softwareVersion}`);
  } else {
    fetch(`${baseUrl}&${name}=${value}&ut=${time}&os=${os}&m=${device}&v=${softwareVersion}`, {
      method: 'POST',
      keepalive: true,
    });
  }
}

export const gatherMetrics = (baseUrl, softwareVersion, sampleFactor) => {
  /**
   * Make a sampling decision whether to ingest metrics from this request.
   */
  const shouldSampleRequest = Date.now() % sampleFactor === 0;

  getCLS(reportMetric(baseUrl, softwareVersion, shouldSampleRequest));
  getFID(reportMetric(baseUrl, softwareVersion, shouldSampleRequest));
  getLCP(reportMetric(baseUrl, softwareVersion, shouldSampleRequest));
}
