/**
  * @returns {void}
  */
export function initialize(applicationInstance) {
  const runtimeConfig = applicationInstance.lookup('service:runtimeConfig');

  if (typeof FastBoot !== 'undefined') {
    return;
  }

  if (typeof VisitSource === 'function') {
    (new VisitSource('WikiaSessionSource', runtimeConfig.cookieDomain)).checkAndStore();
    (new VisitSource('WikiaLifetimeSource', runtimeConfig.cookieDomain, false)).checkAndStore();
  }
}

export default {
  after: 'config',
  name: 'visit-source',
  initialize,
};
