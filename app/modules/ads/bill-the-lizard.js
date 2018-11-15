import targeting from './targeting';
import pageTracker from './tracking/page-tracker';

let config = null;
let cheshirecatCalled = false;
let incontentsCounter = 1;

function getNextIncontentId() {
  return `incontent_boxad_${incontentsCounter}`;
}

function serializeBids(slotName) {
  const bidderPrices = targeting.getBiddersPrices(slotName, false);

  return {
    bids: [
      bidderPrices.bidder_1 || 0,
      bidderPrices.bidder_2 || 0,
      bidderPrices.bidder_3 || 0,
      bidderPrices.bidder_4 || 0,
      bidderPrices.bidder_5 || 0,
      bidderPrices.bidder_6 || 0,
      bidderPrices.bidder_7 || 0,
      bidderPrices.bidder_8 || 0,
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
    const { context, events, slotService } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;

    if (context.get('bidders.prebid.bidsRefreshing.enabled')) {
      config = instantGlobals.wgAdDriverBillTheLizardConfig || {};

      context.set('services.billTheLizard.projects', config.projects);
      context.set('services.billTheLizard.timeout', config.timeout || 0);

      billTheLizard.projectsHandler.enable('cheshirecat');
      billTheLizard.executor.register('catlapseIncontentBoxad', () => {
        slotService.disable(getNextIncontentId(), 'catlapsed');
      });

      context.set('bidders.prebid.bidsRefreshing.bidsBackHandler', this.callCheshireCat.bind(this));
      context.push('listeners.slot', {
        onRenderEnded: (adSlot) => {
          if (adSlot.getSlotName() === 'incontent_boxad_1' && !cheshirecatCalled) {
            this.callCheshireCat();
          }
        },
      });

      events.on(events.AD_SLOT_CREATED, (adSlot) => {
        if (adSlot.getSlotName().indexOf('incontent_boxad_') === 0) {
          incontentsCounter += 1;
        }
      });

      events.on(events.BIDS_REFRESH, () => {
        cheshirecatCalled = true;
      });

      events.on(events.BILL_THE_LIZARD_REQUEST, (query) => {
        pageTracker.trackProp('btl_request', query);
      });
    }
  },

  callCheshireCat() {
    const { context } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;

    context.set('services.billTheLizard.parameters.cheshirecat', serializeBids('mobile_in_content'));
    cheshirecatCalled = true;

    billTheLizard.call(['cheshirecat']);
  },

  hasAvailableModels(btlConfig, projectName) {
    const { utils } = window.Wikia.adEngine;
    const projects = btlConfig.projects || config.projects;

    return projects && projects[projectName]
      && projects[projectName].some(model => utils.isProperGeo(model.countries));
  },

  reset() {
    const { billTheLizard } = window.Wikia.adServices;

    cheshirecatCalled = false;
    incontentsCounter = 1;

    // Reset predictions from previous page views
    billTheLizard.predictions = {};
  },
};
