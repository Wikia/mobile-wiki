import { targeting } from './targeting';
import { pageTracker } from './tracking/page-tracker';

const AD_SLOT_CATLAPSED_STATUS = 'catlapsed';
const bidPosKeyVal = 'mobile_in_content';
const NOT_USED_STATUS = 'not_used';
const logGroup = 'bill-the-lizard-wrapper';

let config = null;
let cheshirecatCalled = false;
// TODO: Remove initialValueOfIncontentsCounter and
//  use 0 everywhere once we fully switch to top_boxad
let initialValueOfIncontentsCounter = 1;
let incontentsCounter = initialValueOfIncontentsCounter;
let defaultStatus = NOT_USED_STATUS;
let refreshedSlotNumber = null;

function getCallId(counter = null) {
  const { context } = window.Wikia.adEngine;

  if (context.get('options.useTopBoxad') && (counter || incontentsCounter) === 0) {
    return 'top_boxad';
  }

  return `incontent_boxad_${counter || incontentsCounter}`;
}

function serializeBids(slotName) {
  return targeting.getBiddersPrices(slotName, false).then(bidderPrices => [
    bidderPrices.bidder_0 || 0, // wikia adapter
    bidderPrices.bidder_1 || 0,
    bidderPrices.bidder_2 || 0,
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
    bidderPrices.bidder_17 || 0,
    bidderPrices.bidder_18 || 0,
  ].join(','));
}

function getBtlSlotStatus(btlStatus, callId, fallbackStatus) {
  const { billTheLizard, BillTheLizard } = window.Wikia.adServices;
  let slotStatus;

  switch (btlStatus) {
    case BillTheLizard.TOO_LATE:
    case BillTheLizard.TIMEOUT:
    case BillTheLizard.FAILURE: {
      const prevPrediction = billTheLizard.getPreviousPrediction(incontentsCounter, getCallId, 'cheshirecat');

      slotStatus = btlStatus;
      if (prevPrediction !== undefined) {
        slotStatus += `;res=${prevPrediction.result};${prevPrediction.callId}`;
      }
      break;
    }
    case BillTheLizard.ON_TIME: {
      const prediction = billTheLizard.getPrediction('cheshirecat', callId);
      const result = prediction ? prediction.result : undefined;
      slotStatus = `${BillTheLizard.ON_TIME};res=${result};${callId}`;
      break;
    }
    default: {
      if (fallbackStatus === NOT_USED_STATUS) {
        // we don't use a slot until we got response from Bill
        return NOT_USED_STATUS;
      }

      const prevPrediction = billTheLizard.getPreviousPrediction(incontentsCounter, getCallId, 'cheshirecat');

      if (prevPrediction === undefined) {
        // probably impossible but set in debugging purposes
        return 'weird_cat';
      }

      slotStatus = `${BillTheLizard.REUSED};res=${prevPrediction.result};${prevPrediction.callId}`;
    }
  }

  return slotStatus;
}

export const billTheLizardWrapper = {
  configureBillTheLizard(billTheLizardConfig) {
    const {
      context, events, eventService, slotService, utils,
    } = window.Wikia.adEngine;
    const { billTheLizard, BillTheLizard, billTheLizardEvents } = window.Wikia.adServices;
    let baseSlotName = 'incontent_boxad_1';
    defaultStatus = NOT_USED_STATUS;

    context.set('options.cheshireCatFirstSlot', 'top_boxad');

    // TODO clean up once we fully switch to top_boxad
    if (context.get('options.useTopBoxad')) {
      baseSlotName = 'top_boxad';
      initialValueOfIncontentsCounter = 0;
      incontentsCounter = initialValueOfIncontentsCounter;
    }

    if (!context.get('bidders.prebid.bidsRefreshing.enabled')) {
      return;
    }

    config = billTheLizardConfig;

    if (!this.hasAvailableModels(config, 'cheshirecat')) {
      return;
    }

    context.set('services.billTheLizard.projects', config.projects);
    context.set('services.billTheLizard.timeout', config.timeout || 0);

    const enableCheshireCat = context.get('options.billTheLizard.cheshireCat');

    if (enableCheshireCat === true) {
      billTheLizard.projectsHandler.enable('cheshirecat');
    }

    billTheLizard.executor.register('catlapseIncontentBoxad', () => {
      const slotNameToCatlapse = getCallId();
      slotService.on(slotNameToCatlapse, AD_SLOT_CATLAPSED_STATUS, () => {
        utils.logger(logGroup, `Catlapsing ${slotNameToCatlapse}`);
        // eslint-disable-next-line no-console
        console.log(`Catlapsing ${slotNameToCatlapse}`);
      });
      slotService.disable(getCallId(), AD_SLOT_CATLAPSED_STATUS);
    });

    context.set(
      'bidders.prebid.bidsRefreshing.bidsBackHandler',
      () => {
        if (refreshedSlotNumber && refreshedSlotNumber > initialValueOfIncontentsCounter) {
          const callId = getCallId(refreshedSlotNumber);

          this.callCheshireCat(callId);
        }
      },
    );

    context.push('listeners.slot', {
      onRenderEnded: (adSlot) => {
        if (adSlot.getSlotName() === baseSlotName && !cheshirecatCalled) {
          this.callCheshireCat(baseSlotName);
        }
      },
    });

    eventService.on(events.AD_SLOT_CREATED, (adSlot) => {
      if (adSlot.getConfigProperty('cheshireCatSlot')) {
        const callId = getCallId();
        adSlot.setConfigProperty('btlStatus', getBtlSlotStatus(
          billTheLizard.getResponseStatus(callId),
          callId,
          defaultStatus,
        ));
        incontentsCounter += 1;
      }
    });

    eventService.on(events.BIDS_REFRESH, () => {
      cheshirecatCalled = true;
      refreshedSlotNumber = incontentsCounter;
    });

    eventService.on(billTheLizardEvents.BILL_THE_LIZARD_REQUEST, (event) => {
      const { query, callId } = event;
      let propName = 'btl_request';
      if (callId) {
        propName = `${propName}_${callId}`;
      }

      pageTracker.trackProp(propName, query);
    });

    eventService.on(billTheLizardEvents.BILL_THE_LIZARD_RESPONSE, (event) => {
      const { response, callId } = event;
      let propName = 'btl_response';
      if (callId) {
        propName = `${propName}_${callId}`;
        defaultStatus = BillTheLizard.REUSED;
      }
      pageTracker.trackProp(propName, response);
    });
  },

  /**
   * Call BTL for Cheshire Cat predictions
   *
   * @param {number|string} callId
   */
  callCheshireCat(callId) {
    const { context } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;
    console.log('callCheshire', callId);
    serializeBids(bidPosKeyVal).then((bids) => {
      context.set('services.billTheLizard.parameters.cheshirecat', {
        bids,
      });
      cheshirecatCalled = true;

      billTheLizard.call(['cheshirecat'], callId);
    });
  },

  getBtlSlotStatus,

  hasAvailableModels(btlConfig, projectName) {
    const { utils } = window.Wikia.adEngine;
    const projects = btlConfig.projects || config.projects;

    return projects && projects[projectName]
      && projects[projectName].some(
        model => utils.geoService.isProperGeo(model.countries, model.name),
      );
  },

  reset() {
    const { billTheLizard } = window.Wikia.adServices;

    cheshirecatCalled = false;
    incontentsCounter = initialValueOfIncontentsCounter;
    defaultStatus = NOT_USED_STATUS;
    refreshedSlotNumber = null;

    // Recheck available models for Labrador decisions
    this.hasAvailableModels(config, 'cheshirecat');

    // Reset predictions from previous page views
    billTheLizard.reset();
  },
};

export default billTheLizardWrapper;
