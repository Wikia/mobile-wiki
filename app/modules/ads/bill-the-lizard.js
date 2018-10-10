import targeting from './targeting';

const cheshirecatPredictions = {};

let cheshirecatConfig = null;
let cheshirecatCalled = false;
let biddersCalled = false;

export default {
  configureBillTheLizard(instantGlobals) {
    const { context, slotService } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;

    if (context.get('bidders.prebid.bidsRefreshing.enabled')) {
      cheshirecatConfig = instantGlobals.wgAdDriverBillTheLizardConfig || {};

      context.set('services.billTheLizard.projects', cheshirecatConfig.projects);
      context.set('services.billTheLizard.timeout', cheshirecatConfig.timeout || 0);

      billTheLizard.projectsHandler.enable('cheshirecat');
      billTheLizard.executor.register('catlapseIncontentBoxad', () => {
        slotService.disable(this.getNextIncontentId(cheshirecatPredictions), 'catlapsed');
      });

      context.set('bidders.prebid.bidsRefreshing.bidsBackHandler', this.callCheshireCat.bind(this));
      context.push('listeners.slot', {
        onRenderEnded: (adSlot) => {
          if (adSlot.config.slotName === 'incontent_boxad_1' && biddersCalled && !cheshirecatCalled) {
            this.callCheshireCat();
          }
        },
      });
    }
  },

  callCheshireCat() {
    const { context } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;

    context.set('services.billTheLizard.parameters.cheshirecat', this.serializeBids('mobile_in_content'));

    cheshirecatCalled = true;

    billTheLizard.call(['cheshirecat'])
      .then((predictions) => {
        const identifier = this.getNextIncontentId(cheshirecatPredictions);
        const prediction = Object.keys(predictions).map(key => `${key}=${predictions[key]}`).join(';');

        cheshirecatPredictions[identifier] = prediction;
        context.set(`services.billTheLizard.parameters.cheshirecatSlotResponses.${identifier}`, prediction);
      });
  },

  getNextIncontentId(predictions) {
    return `incontent_boxad_${Object.keys(predictions).length + 2}`;
  },

  serializeBids(slotName) {
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
  },

  updateCallStatuses(statuses) {
    biddersCalled = statuses.bidders !== undefined
      ? statuses.bidders
      : biddersCalled;
    cheshirecatCalled = statuses.cheshirecat !== undefined
      ? statuses.cheshirecat
      : cheshirecatCalled;
  },
};
