import {
  context,
  events,
  eventService,
  slotInjector,
  slotRepeater,
  utils,
} from '@wikia/ad-engine';

const logGroup = 'slots-loader';

export const slotsLoader = {
  baseSlotName: 'incontent_boxad',
  incontentsCounter: 0,

  getSlotId() {
    return `${this.baseSlotName}_${this.incontentsCounter}`;
  },

  configureSlotsLoader() {
    const bidsBackHandler = context.get('bidders.prebid.bidsRefreshing.bidsBackHandler');

    if (!context.get('options.nonLazyIncontents.enabled')) {
      return;
    }

    context.set(
      'bidders.prebid.bidsRefreshing.bidsBackHandler',
      () => {
        const slotId = this.getSlotId();

        utils.logger(logGroup, `refresh ended for: ${slotId}`);
        context.get(`bidders.prebid.bidsRefreshing.${slotId}.resolve`)();
        bidsBackHandler();
      },
    );

    eventService.on(events.BIDS_REFRESH_STARTED, (adUnitCode) => {
      const incontentAdUnitCode = context.get('slots.incontent_boxad_1.bidderAlias');

      if (adUnitCode === incontentAdUnitCode) {
        this.incontentsCounter += 1;
        const slotId = this.getSlotId();

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
    });

    eventService.on(events.AD_SLOT_CREATED, (adSlot) => {
      adSlot.loaded.then(() => this.injectNextSlot(adSlot));
    });
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
    const bidsRefreshedPromise = context.get(`bidders.prebid.bidsRefreshing.${firstSlotName}.finished`);

    this.handleBidsRefreshPromise(
      firstSlotName,
      bidsRefreshedPromise,
      this.injectFirstSlot,
      firstSlotName,
    );
  },

  injectFirstSlot(firstSlotName) {
    utils.logger(logGroup, `insertion started: ${firstSlotName}`);
    slotInjector.inject(firstSlotName);
    context.push('state.adStack', { id: firstSlotName });
  },

  handleBidsRefreshPromise(slotName, promise, injectingCallback, ...args) {
    utils.logger(logGroup, `insertion waiting: ${slotName}`);

    if (promise) {
      promise.then(() => {
        injectingCallback(...args);
      });
    } else {
      injectingCallback(...args);
    }
  },

  loadNextSlot(adSlot) {
    const adProduct = adSlot.config.adProduct;
    const currentBoxadNumber = parseInt(adProduct.split('_').pop(), 10);
    const nextBoxad = `${this.baseSlotName}_${currentBoxadNumber + 1}`;
    const bidsRefreshedPromise = context.get(`bidders.prebid.bidsRefreshing.${nextBoxad}.finished`);

    this.handleBidsRefreshPromise(
      nextBoxad,
      bidsRefreshedPromise,
      this.repeatSlot,
      adSlot,
      nextBoxad,
    );
  },

  repeatSlot(adSlot, nextSlotName) {
    utils.logger(logGroup, `repeating started: ${nextSlotName}`);
    slotRepeater.handleSlotRepeating(adSlot);
  },

  reset() {
    this.incontentsCounter = 0;
  },
};

export default slotsLoader;
