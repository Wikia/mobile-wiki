import targeting from './targeting';

let config = null;
let cheshirecatCalled = false;
let cheshirecatPredictions = {};

function getNextIncontentId(predictions) {
  return `incontent_boxad_${Object.keys(predictions).length + 2}`;
}

function serializeBids(slotName) {
  const bidderPrices = targeting.getBiddersPrices(slotName);

  return {
    bids: [
      bidderPrices.bidder_1 || 0,
      bidderPrices.bidder_2 || 0,
      0,
      bidderPrices.bidder_4 || 0,
      0,
      bidderPrices.bidder_6 || 0,
      bidderPrices.bidder_7 || 0,
      0,
      bidderPrices.bidder_9 || 0,
      bidderPrices.bidder_10 || 0,
      bidderPrices.bidder_11 || 0,
      bidderPrices.bidder_12 || 0,
      bidderPrices.bidder_13 || 0,
      bidderPrices.bidder_14 || 0,
      bidderPrices.bidder_15 || 0,
      bidderPrices.bidder_16 || 0,
    ].join(';'),
  };
}

export default {
  configureBillTheLizard(instantGlobals) {
    const { context, slotService } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;

    if (context.get('bidders.prebid.bidsRefreshing.enabled')) {
      config = instantGlobals.wgAdDriverBillTheLizardConfig || {};

      context.set('services.billTheLizard.projects', config.projects);
      context.set('services.billTheLizard.timeout', config.timeout || 0);

      billTheLizard.projectsHandler.enable('cheshirecat');
      billTheLizard.executor.register('catlapseIncontentBoxad', () => {
        slotService.disable(getNextIncontentId(cheshirecatPredictions), 'catlapsed');
      });

      context.set('bidders.prebid.bidsRefreshing.bidsBackHandler', this.callCheshireCat.bind(this));
      context.push('listeners.slot', {
        onRenderEnded: (adSlot) => {
          if (adSlot.config.slotName === 'incontent_boxad_1' && !cheshirecatCalled) {
            this.callCheshireCat();
          }
        },
      });
    }
  },

  callCheshireCat() {
    const { context } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;

    context.set('services.billTheLizard.parameters.cheshirecat', serializeBids('mobile_in_content'));

    cheshirecatCalled = true;

    billTheLizard.call(['cheshirecat'])
      .then((predictions) => {
        const identifier = getNextIncontentId(cheshirecatPredictions);
        const prediction = Object.keys(predictions).map(key => `${key}=${predictions[key]}`).join(';');

        cheshirecatPredictions[identifier] = prediction;
        context.set(`services.billTheLizard.parameters.cheshirecatSlotResponses.${identifier}`, prediction);
      });
  },

  reset() {
    cheshirecatCalled = false;
    cheshirecatPredictions = {};
  },
};
