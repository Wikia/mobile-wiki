import {
  context,
  events,
  eventService,
  slotInjector,
  slotRepeater,
  utils,
} from '@wikia/ad-engine';

export const slotsLoader = {
  baseSlotName: 'incontent_boxad',
  incontentsCounter: 0,
  logGroup: 'slots-loader',

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

        utils.logger(this.logGroup, `refresh ended for: ${slotId}`);
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

        utils.logger(this.logGroup, `refresh started for ${slotId}`);
      }
    });

    eventService.on(events.AD_SLOT_CREATED, (adSlot) => {
      adSlot.loaded.then(() => this.injectNextSlot(adSlot));
    });
  },

  injectNextSlot(adSlot) {
    const adProduct = adSlot.config.adProduct;

    if (adProduct === 'top_boxad') {
      return this.loadFirstSlot();
    }
    if (adProduct.indexOf(this.baseSlotName) !== 0) {
      return false;
    }

    return this.handleSlotRepeatingWhenBidsRefreshed(adSlot);
  },

  loadFirstSlot() {
    const firstSlotName = `${this.baseSlotName}_1`;
    const bidsRefreshedPromise = context.get(`bidders.prebid.bidsRefreshing.${firstSlotName}.finished`);

    utils.logger(this.logGroup, `insertion waiting: ${firstSlotName}`);
    if (bidsRefreshedPromise) {
      bidsRefreshedPromise.then(() => {
        this.injectFirstSlot(firstSlotName);
      });
    } else {
      this.injectFirstSlot(firstSlotName);
    }
  },

  injectFirstSlot(firstSlotName) {
    utils.logger(this.logGroup, `insertion started: ${firstSlotName}`);
    slotInjector.inject(firstSlotName);
    context.push('state.adStack', { id: firstSlotName });
  },

  handleSlotRepeatingWhenBidsRefreshed(adSlot) {
    const adProduct = adSlot.config.adProduct;
    const currentBoxadNumber = parseInt(adProduct.split('_').pop(), 10);
    const nextBoxad = `${this.baseSlotName}_${currentBoxadNumber + 1}`;
    const bidsRefreshedPromise = context.get(`bidders.prebid.bidsRefreshing.${nextBoxad}.finished`);

    utils.logger(this.logGroup, `repeating waiting: ${nextBoxad}`);
    if (bidsRefreshedPromise) {
      bidsRefreshedPromise.then(() => this.repeatSlot(adSlot, nextBoxad));
    } else {
      this.repeatSlot(adSlot, nextBoxad);
    }
  },

  repeatSlot(adSlot, nextSlotName) {
    utils.logger(this.logGroup, `repeating started: ${nextSlotName}`);

    return slotRepeater.handleSlotRepeating(adSlot);
  },

  reset() {
    this.incontentsCounter = 0;
  },
};

export default slotsLoader;
