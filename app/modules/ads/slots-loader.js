import {
  context,
  events,
  eventService,
  pbjsFactory,
  slotInjector,
  slotRepeater,
  utils,
} from '@wikia/ad-engine';

const logGroup = 'slots-loader';

export const slotsLoader = {
  baseSlotName: 'incontent_boxad',
  prebidIncontents: [],

  getCurrentSlotId() {
    const slotNumber = this.prebidIncontents.shift();
    return `${this.baseSlotName}_${slotNumber}`;
  },

  configureSlotsLoader() {
    const bidsBackHandler = context.get('bidders.prebid.bidsRefreshing.bidsBackHandler');

    if (!context.get('options.nonLazyIncontents.enabled')) {
      return;
    }

    context.set(
      'bidders.prebid.bidsRefreshing.bidsBackHandler',
      () => {
        const slotId = this.getCurrentSlotId();

        utils.logger(logGroup, `refresh ended for: ${slotId}`);
        context.get(`bidders.prebid.bidsRefreshing.${slotId}.resolve`)();
        bidsBackHandler();
      },
    );

    pbjsFactory.init().then(() => {
      const originalRenderAd = window.pbjs.renderAd;
      window.pbjs.renderAd = (document, adId) => {
        const slotId = this.getNextIncontentSlotName(adId);

        if (slotId) {
          const slotNumber = parseInt(slotId.split('_').pop(), 10);

          this.prebidIncontents.push(slotNumber);
          context.set(
            `bidders.prebid.bidsRefreshing.${slotId}.finished`,
            new Promise((resolve) => {
              context.set(
                `bidders.prebid.bidsRefreshing.${slotId}.resolve`,
                resolve,
              );
            }),
          );

          utils.logger(logGroup, `refresh started for ${slotId}`);
        }

        originalRenderAd(document, adId);
      };
    });

    eventService.on(events.AD_SLOT_CREATED, (adSlot) => {
      adSlot.rendered.then(() => this.injectNextSlot(adSlot));
    });
  },

  /**
   * Returns the name of the ad slot which follows the just refreshed one
   * @param adId
   * @returns {string}
   */
  getNextIncontentSlotName(adId) {
    const refreshedSlotName = this.getRefreshedSlotName(adId);

    if (refreshedSlotName === 'top_boxad') {
      return 'incontent_boxad_1';
    }
    if (refreshedSlotName.indexOf(this.baseSlotName) !== -1) {
      const lastSlotNumber = parseInt(refreshedSlotName.split('_').pop(), 10);
      return `incontent_boxad_${lastSlotNumber + 1}`;
    }
    return '';
  },

  getRefreshedSlotName(adId) {
    let refreshedSlotName = '';
    const availableSlots = this.getAvailableSlots();

    availableSlots.forEach((slotName) => {
      const slotBidderAdId = context.get(`slots.${slotName}`).targeting.hb_adid;

      if (slotBidderAdId === adId) {
        refreshedSlotName = slotName;
      }
    });

    return refreshedSlotName;
  },

  getAvailableSlots() {
    const availableSlots = ['top_boxad'];
    let slotNumber = 1;
    let slotContext = context.get('slots.incontent_boxad_1');

    while (slotContext) {
      if (slotContext) {
        availableSlots.push(`incontent_boxad_${slotNumber}`);
        slotNumber += 1;
        slotContext = context.get(`slots.incontent_boxad_${slotNumber}`);
      }
    }

    return availableSlots;
  },

  injectNextSlot(adSlot) {
    const adProduct = adSlot.config.adProduct;

    if (adProduct === 'top_boxad') {
      this.loadFirstSlot();
    }
    if (adProduct.indexOf(this.baseSlotName) === 0) {
      this.loadNextSlot(adSlot);
    }
  },

  loadFirstSlot() {
    const firstSlotName = `${this.baseSlotName}_1`;

    this.handleBidsRefreshPromise(
      this.injectFirstSlot,
      firstSlotName,
    );
  },

  injectFirstSlot(firstSlotName) {
    utils.logger(logGroup, `injection started: ${firstSlotName}`);
    slotInjector.inject(firstSlotName);
    context.push('state.adStack', { id: firstSlotName });
  },

  handleBidsRefreshPromise(injectingCallback, slotName, ...args) {
    const bidsRefreshedPromise = context.get(`bidders.prebid.bidsRefreshing.${slotName}.finished`);
    utils.logger(logGroup, `injection waiting: ${slotName}`);

    if (bidsRefreshedPromise) {
      bidsRefreshedPromise.then(() => {
        injectingCallback(slotName, ...args);
      });
    } else {
      injectingCallback(slotName, ...args);
    }
  },

  loadNextSlot(adSlot) {
    const adProduct = adSlot.config.adProduct;
    const currentBoxadNumber = parseInt(adProduct.split('_').pop(), 10);
    const nextBoxadName = `${this.baseSlotName}_${currentBoxadNumber + 1}`;

    this.handleBidsRefreshPromise(
      this.repeatSlot,
      nextBoxadName,
      adSlot,
    );
  },

  repeatSlot(nextSlotName, adSlot) {
    utils.logger(logGroup, `injection started: ${nextSlotName}`);
    slotRepeater.handleSlotRepeating(adSlot);
  },

  reset() {
    this.prebidIncontents = [];
  },
};

export default slotsLoader;
