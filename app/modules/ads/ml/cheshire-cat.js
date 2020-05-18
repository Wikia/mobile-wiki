import { targeting } from '../targeting';
import hasAvailableModels from './utils';

const AD_SLOT_CATLAPSED_STATUS = 'catlapsed';
const bidPosKeyVal = 'mobile_in_content';
const NOT_USED_STATUS = 'not_used';
const logGroup = 'cheshire-cat-model';

let config = {};
let cheshirecatCalled = false;
let incontentsCounter = 0;
let defaultStatus = NOT_USED_STATUS;
let refreshedSlotNumber = null;

/**
 * @param {number} counter
 */
function getCallId(counter) {
  if (!counter) {
    return 'top_boxad';
  }

  return `incontent_boxad_${counter}`;
}

/**
 * Check bids from prebid and concatinates all the values
 *
 * @param {string} slotName
 * @returns {string}
 */
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

/**
 * Check response from bill the lizard and passes status for ad slot
 *
 * @param {string} btlStatus
 * @param {number|string} callId
 * @param {string} fallbackStatus
 * @returns {string}
 */
function getBtlSlotStatus(btlStatus, callId, fallbackStatus) {
  const { billTheLizard, BillTheLizard } = window.Wikia.adEngine;
  let slotStatus;

  switch (btlStatus) {
    case BillTheLizard.TOO_LATE:
    case BillTheLizard.TIMEOUT:
    case BillTheLizard.FAILURE: {
      const prevPrediction = billTheLizard.getLastReusablePrediction('cheshirecat');

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

      const prevPrediction = billTheLizard.getLastReusablePrediction('cheshirecat');

      if (prevPrediction === undefined) {
        // probably impossible but set in debugging purposes
        return 'weird_cat';
      }

      slotStatus = `${BillTheLizard.REUSED};res=${prevPrediction.result};${prevPrediction.callId}`;
    }
  }

  return slotStatus;
}

export const cheshireCat = {
  /**
   * @param {Object} billTheLizardConfig
   */
  configure(billTheLizardConfig) {
    const {
      AdSlot,
      billTheLizard,
      billTheLizardEvents,
      BillTheLizard,
      context,
      events,
      eventService,
      slotService,
      utils,
    } = window.Wikia.adEngine;
    const baseSlotName = 'top_boxad';
    config = billTheLizardConfig;
    defaultStatus = NOT_USED_STATUS;

    if (!hasAvailableModels(config, 'cheshirecat')) {
      return;
    }

    const enableCheshireCat = context.get('options.billTheLizard.cheshireCat');

    if (enableCheshireCat === true) {
      billTheLizard.projectsHandler.enable('cheshirecat');
    }

    billTheLizard.executor.register('catlapseIncontentBoxad', () => {
      const slotNameToCatlapse = getCallId(incontentsCounter);
      slotService.on(slotNameToCatlapse, AD_SLOT_CATLAPSED_STATUS, () => {
        utils.logger(logGroup, `Catlapsing ${slotNameToCatlapse}`);
      });
      slotService.disable(getCallId(incontentsCounter), AD_SLOT_CATLAPSED_STATUS);
    });

    context.set(
      'bidders.prebid.bidsRefreshing.bidsBackHandler',
      () => {
        const callId = getCallId(refreshedSlotNumber);

        if (refreshedSlotNumber && refreshedSlotNumber > 0) {
          this.callCheshireCat(callId);
        }
      },
    );

    eventService.on(AdSlot.SLOT_RENDERED_EVENT, (adSlot) => {
      if (adSlot.getSlotName() === baseSlotName && !cheshirecatCalled) {
        this.callCheshireCat(baseSlotName);
      }
    });

    eventService.on(events.AD_SLOT_CREATED, (adSlot) => {
      if (adSlot.getConfigProperty('cheshireCatSlot')) {
        const callId = getCallId(incontentsCounter);
        adSlot.setConfigProperty('btlStatus', getBtlSlotStatus(
          billTheLizard.getResponseStatus(callId),
          callId,
          defaultStatus,
        ));
        incontentsCounter += 1;
      }
    });

    eventService.on(events.BIDS_REFRESH, (refreshedSlotNames) => {
      if (refreshedSlotNames.includes(bidPosKeyVal)) {
        cheshirecatCalled = true;
        refreshedSlotNumber = incontentsCounter;
      }
    });

    eventService.on(billTheLizardEvents.BILL_THE_LIZARD_RESPONSE, (event) => {
      if (event.response.includes('cheshire')) {
        if (event.callId) {
          defaultStatus = BillTheLizard.REUSED;
        }
      }
    });

    utils.logger(logGroup, 'configured');
  },

  /**
   * Call BTL for Cheshire Cat predictions
   *
   * @param {number|string} callId
   */
  callCheshireCat(callId) {
    const { context } = window.Wikia.adEngine;
    const { billTheLizard } = window.Wikia.adServices;

    serializeBids(bidPosKeyVal).then((bids) => {
      context.set('services.billTheLizard.parameters.cheshirecat', {
        bids,
      });
      cheshirecatCalled = true;

      billTheLizard.call(['cheshirecat'], callId);
    });
  },

  getBtlSlotStatus,

  reset() {
    cheshirecatCalled = false;
    incontentsCounter = 0;
    defaultStatus = NOT_USED_STATUS;
    refreshedSlotNumber = null;

    // Recheck available models for Labrador decisions
    hasAvailableModels(config, 'cheshirecat');
  },
};

export default cheshireCat;
