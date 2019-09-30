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

    this.handleBidsRefreshPromise(
      this.injectFirstSlot,
      firstSlotName,
    );
  },

  injectFirstSlot(firstSlotName) {
    utils.logger(logGroup, `insertion started: ${firstSlotName}`);
    slotInjector.inject(firstSlotName);
    context.push('state.adStack', { id: firstSlotName });
  },

  handleBidsRefreshPromise(injectingCallback, slotName, ...args) {
    const bidsRefreshedPromise = context.get(`bidders.prebid.bidsRefreshing.${slotName}.finished`);
    utils.logger(logGroup, `insertion waiting: ${slotName}`);

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
      adSlot
    );
  },

  repeatSlot(nextSlotName, adSlot) {
    utils.logger(logGroup, `repeating started: ${nextSlotName}`);
    slotRepeater.handleSlotRepeating(adSlot);
  },

  reset() {
    this.incontentsCounter = 0;
  },
};

export default slotsLoader;
