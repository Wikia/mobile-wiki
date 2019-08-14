const MIN_NUMBER_OF_SECTIONS = 4;
const PAGE_TYPES = {
  article: 'a',
  home: 'h',
};
const BIG_VIEWPORT_SIZE = {
  height: 627,
  width: 375,
};

function isTopLeaderboardApplicable() {
  const { context } = window.Wikia.adEngine;

  const hasFeaturedVideo = context.get('custom.hasFeaturedVideo');
  const isHome = context.get('custom.pageType') === 'home';
  const isSearch = context.get('custom.pageType') === 'search';
  const isSearchPageTlbEnabled = context.get('custom.isSearchPageTlbEnabled');
  const hasPageHeader = !!document.querySelector('.wiki-page-header');
  const hasPortableInfobox = !!document.querySelector('.portable-infobox');

  return (isSearch && isSearchPageTlbEnabled)
    || isHome
    || hasPortableInfobox
    || ((hasPageHeader > 0) && (!hasFeaturedVideo));
}

function isInContentApplicable() {
  const { context } = window.Wikia.adEngine;

  if (context.get('custom.pageType') === 'home') {
    return !!document.querySelector('.curated-content');
  }

  return context.get('custom.pageType') !== 'search';
}

function isPrefooterApplicable(inContentApplicable) {
  const { context } = window.Wikia.adEngine;

  if (context.get('custom.pageType') === 'home') {
    return !!document.querySelector('.trending-articles');
  }

  const numberOfSections = document.querySelectorAll('.article-content > h2').length;
  const hasArticleFooter = !!document.querySelector('.article-footer');

  return (hasArticleFooter && !inContentApplicable)
    || (numberOfSections > MIN_NUMBER_OF_SECTIONS);
}

function isBottomLeaderboardApplicable() {
  const { context } = window.Wikia.adEngine;

  return !!document.querySelector('.wds-global-footer') && context.get('custom.pageType') !== 'search';
}

/**
 * Decides if incontent_player slot should be active.
 *
 * @returns {boolean}
 */
function isIncontentPlayerApplicable() {
  const { context } = window.Wikia.adEngine;

  return context.get('custom.pageType') !== 'home'
    && !context.get('custom.hasFeaturedVideo')
    && !context.get('custom.isIncontentPlayerDisabled');
}

/**
 * Decides if incontent_native slot should be active.
 *
 * @returns {boolean}
 */
function isIncontentNativeApplicable() {
  const { context } = window.Wikia.adEngine;
  const isIncontentNativeEnabled = context.get('custom.isIncontentNativeEnabled');
  const isSearch = context.get('custom.pageType') === 'search';

  return isSearch && isIncontentNativeEnabled;
}

/**
 * Decides if floor_adhesion slot should be active.
 *
 * It is disabled if page has FV.
 *
 * @returns {boolean}
 */
function isFloorAdhesionApplicable() {
  const { context } = window.Wikia.adEngine;

  return !context.get('custom.hasFeaturedVideo') && !context.get('slots.floor_adhesion.disabled');
}

/**
 * Decides if invisible_high_impact_2 slot should be active.
 *
 * It is disabled if page has FV or floor_adhesion is enabled.
 *
 * @returns {boolean}
 */
function isInvisibleHighImpact2Applicable() {
  const { context } = window.Wikia.adEngine;

  return !context.get('custom.hasFeaturedVideo') && context.get('slots.floor_adhesion.disabled');
}

export const slots = {
  getContext() {
    return {
      top_leaderboard: {
        aboveTheFold: true,
        firstCall: true,
        adProduct: 'top_leaderboard',
        slotNameSuffix: '',
        bidderAlias: 'mobile_top_leaderboard',
        group: 'LB',
        options: {},
        slotShortcut: 'l',
        sizes: [],
        defaultSizes: [[320, 50], [320, 100], [300, 50]],
        defaultTemplates: [],
        targeting: {
          loc: 'top',
          pos: ['top_leaderboard', 'mobile_top_leaderboard'],
          rv: 1,
        },
      },
      top_boxad: {
        adProduct: 'top_boxad',
        avoidConflictWith: '.ad-slot',
        bidderAlias: 'mobile_in_content',
        cheshireCatSlot: true,
        slotNameSuffix: '',
        group: 'MR',
        options: {},
        slotShortcut: 'm',
        sizes: [
          {
            viewportSize: [BIG_VIEWPORT_SIZE.width, BIG_VIEWPORT_SIZE.height],
            sizes: [[300, 50], [320, 50], [300, 250], [300, 600]],
          },
        ],
        defaultSizes: [[320, 50], [300, 250], [300, 50]],
        targeting: {
          loc: 'top',
          pos: ['top_boxad'],
          rv: 1,
          xna: 1,
        },
      },
      // as this slot can be repeated many, it uses bidderAlias mobile_in_content
      incontent_boxad_1: {
        adProduct: 'incontent_boxad_1',
        avoidConflictWith: '.ad-slot,#incontent_player',
        bidderAlias: 'mobile_in_content',
        viewabilityCounterId: 'incontent_boxad',
        cheshireCatSlot: true,
        defaultClasses: ['hide', 'incontent-boxad', 'ad-slot'],
        slotNameSuffix: '',
        group: 'HiVi',
        options: {},
        insertBeforeSelector: '.article-content > h2',
        repeat: {
          index: 1,
          limit: 20,
          slotNamePattern: 'incontent_boxad_{slotConfig.repeat.index}',
          updateProperties: {
            adProduct: '{slotConfig.slotName}',
            'targeting.rv': '{slotConfig.repeat.index}',
            'targeting.pos': ['incontent_boxad'],
          },
          insertBelowScrollPosition: true,
        },
        slotShortcut: 'f',
        sizes: [
          {
            viewportSize: [BIG_VIEWPORT_SIZE.width, BIG_VIEWPORT_SIZE.height],
            sizes: [[300, 50], [320, 50], [300, 250], [300, 600]],
          },
        ],
        defaultSizes: [[320, 50], [300, 250], [300, 50]],
        targeting: {
          loc: 'middle',
          pos: ['incontent_boxad'],
          rv: 1,
          xna: 1,
        },
      },
      incontent_player: {
        adProduct: 'incontent_player',
        avoidConflictWith: '.ad-slot,#incontent_boxad_1',
        autoplay: true,
        audio: false,
        insertBeforeSelector: '.article-content > h2',
        disabled: true,
        defaultClasses: ['hide'],
        slotNameSuffix: '',
        group: 'HiVi',
        slotShortcut: 'i',
        defaultSizes: [[1, 1]],
        targeting: {
          loc: 'middle',
          pos: ['incontent_player'],
          rv: 1,
        },
      },
      mobile_prefooter: {
        adProduct: 'mobile_prefooter',
        slotNameSuffix: '',
        disabled: true,
        disableManualInsert: true,
        group: 'PF',
        options: {},
        slotShortcut: 'p',
        sizes: [],
        defaultSizes: [[320, 50], [300, 250], [300, 50]],
        targeting: {
          loc: 'footer',
          rv: 1,
        },
      },
      floor_adhesion: {
        adProduct: 'floor_adhesion',
        disabled: true,
        disableManualInsert: true,
        defaultClasses: ['hide'],
        forceSafeFrame: true,
        slotNameSuffix: '',
        group: 'PF',
        options: {},
        outOfPage: false,
        targeting: {
          loc: 'footer',
          rv: 1,
        },
        defaultTemplates: ['floorAdhesion', 'hideOnViewability'],
        defaultSizes: [[300, 50], [320, 50], [320, 100]],
        sizes: [
          {
            viewportSize: [0, 0],
            sizes: [[300, 50], [320, 50], [320, 100]],
          }, {
            // 728px for the ad + 40px width of the close button
            viewportSize: [768, 0],
            sizes: [[300, 50], [320, 50], [320, 100], [728, 90]],
          },
        ],
      },
      bottom_leaderboard: {
        adProduct: 'bottom_leaderboard',
        slotNameSuffix: '',
        group: 'PF',
        options: {},
        slotShortcut: 'b',
        sizes: [
          {
            viewportSize: [375, 627],
            sizes: [[300, 50], [320, 50], [300, 250], [300, 600]],
          },
        ],
        defaultSizes: [[320, 50], [300, 250], [300, 50]],
        targeting: {
          loc: 'footer',
          pos: ['bottom_leaderboard', 'mobile_prefooter'],
          rv: 1,
        },
      },
      invisible_high_impact_2: {
        adProduct: 'invisible_high_impact_2',
        slotNameSuffix: '',
        defaultClasses: ['hide'],
        group: 'PX',
        options: {},
        outOfPage: true,
        targeting: {
          loc: 'hivi',
          rv: 1,
        },
      },
      featured: {
        adProduct: 'featured',
        slotNameSuffix: '',
        nonUapSlot: true,
        group: 'VIDEO',
        lowerSlotName: 'featured',
        targeting: {
          uap: 'none',
        },
        trackingKey: 'featured-video',
        trackEachStatus: true,
      },
      video: {
        adProduct: 'video',
        slotNameSuffix: '',
        nonUapSlot: true,
        group: 'VIDEO',
        lowerSlotName: 'video',
        targeting: {
          uap: 'none',
        },
        trackingKey: 'video',
      },
      incontent_native: {
        firstCall: false,
        defaultSizes: ['fluid'],
        adProduct: 'incontent_native',
        slotNameSuffix: '',
        nonUapSlot: true,
        group: 'NATIVE',
        slotShortcut: 'n',
        lowerSlotName: 'incontent_native',
        sizes: [],
        targeting: {
          uap: 'none',
        },
        trackingKey: 'incontent_native',
      },
    };
  },

  collapseTopLeaderboard() {
    const { AdSlot, context, slotService } = window.Wikia.adEngine;

    context.set('slots.top_leaderboard.trackEachStatus', true);
    slotService.disable('top_leaderboard', AdSlot.STATUS_COLLAPSE);
  },

  setupSlotParameters(slot) {
    const audioSuffix = slot.config.audio === true ? '-audio' : '';
    const clickToPlaySuffix = slot.config.autoplay === true || slot.config.videoDepth > 1 ? '' : '-ctp';

    slot.setConfigProperty('slotNameSuffix', clickToPlaySuffix || audioSuffix || '');
    slot.setConfigProperty('targeting.audio', audioSuffix ? 'yes' : 'no');
    slot.setConfigProperty('targeting.ctp', clickToPlaySuffix ? 'yes' : 'no');
  },

  setupStates(isAdStackEnabled) {
    const { context, slotService } = window.Wikia.adEngine;
    const incontentState = isInContentApplicable();
    const setSlotState = (slotName, state) => {
      if (isAdStackEnabled && state) {
        slotService.enable(slotName);
      } else {
        slotService.disable(slotName);
      }
    };

    if (context.get('state.disableTopLeaderboard')) {
      this.collapseTopLeaderboard();
    } else {
      setSlotState('top_leaderboard', isTopLeaderboardApplicable());
    }
    setSlotState('top_boxad', context.get('options.useTopBoxad') && incontentState);
    setSlotState('incontent_boxad_1', incontentState);
    setSlotState('mobile_prefooter', isPrefooterApplicable(incontentState));
    setSlotState('bottom_leaderboard', isBottomLeaderboardApplicable());

    setSlotState('floor_adhesion', isFloorAdhesionApplicable());
    setSlotState('invisible_high_impact_2', isInvisibleHighImpact2Applicable());

    setSlotState('featured', context.get('custom.hasFeaturedVideo'));
    setSlotState('incontent_player', isIncontentPlayerApplicable());
    setSlotState('incontent_native', isIncontentNativeApplicable());
  },

  setupIdentificators() {
    const { context } = window.Wikia.adEngine;

    const pageTypeParam = PAGE_TYPES[context.get('targeting.s2')] || 'x';
    const slotsDefinition = context.get('slots');

    // Wikia Page Identificator
    context.set('targeting.wsi', `mx${pageTypeParam}1`);
    Object.keys(slotsDefinition).forEach((key) => {
      const slotParam = slotsDefinition[key].slotShortcut || 'x';
      context.set(`slots.${key}.targeting.wsi`, `m${slotParam}${pageTypeParam}1`);
    });
  },

  setupSlotVideoAdUnit(adSlot, params) {
    const { context, utils } = window.Wikia.adEngine;
    const { getAdProductInfo } = window.Wikia.adProducts;

    const adProductInfo = getAdProductInfo(adSlot.getSlotName(), params.type, params.adProduct);
    const adUnit = utils.stringBuilder.build(
      context.get(`slots.${adSlot.getSlotName()}.videoAdUnit`) || context.get('vast.adUnitId'),
      {
        slotConfig: {
          group: adProductInfo.adGroup,
          adProduct: adProductInfo.adProduct,
        },
      },
    );

    context.set(`slots.${adSlot.getSlotName()}.videoAdUnit`, adUnit);
  },

  setupSizesAvailability() {
    const { context } = window.Wikia.adEngine;

    if (
      window.innerHeight >= BIG_VIEWPORT_SIZE.height
      && window.innerWidth >= BIG_VIEWPORT_SIZE.width
    ) {
      context.set('slots.top_boxad.targeting.xna', '0');
      context.set('slots.incontent_boxad_1.targeting.xna', '0');
    }
  },
};

export default slots;
