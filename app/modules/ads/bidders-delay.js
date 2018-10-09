const logGroup = 'bidders-delay';

let delayPromise = null;
let resolvePromise;

export default {
  isEnabled() {
    const { context } = window.Wikia.adEngine;

    return context.get('bidders.enabled');
  },

  getName() {
    return logGroup;
  },

  resetPromise() {
    delayPromise = null;
  },

  getPromise() {
    if (delayPromise === null) {
      delayPromise = new Promise((resolve) => {
        resolvePromise = resolve;
      });
    }

    return delayPromise;
  },

  markAsReady() {
    const { bidders } = window.Wikia.adBidders;

    if (bidders.hasAllResponses()) {
      if (resolvePromise) {
        resolvePromise();
        resolvePromise = null;
      }

      this.biddersCalled = true;
    }
  },
};
