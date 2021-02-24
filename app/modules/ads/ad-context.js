import fallbackInstantConfig from './fallback-config';

export const defaultAdContext = {
  adUnitId: '/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/'
  + '{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
  bidders: {
    enabled: false,
    timeout: 2000,
    a9: {
      amazonId: '3115',
      bidsRefreshing: {
        slots: ['featured', 'mobile_in_content'],
      },
      dealsEnabled: false,
      enabled: false,
      videoEnabled: false,
      slots: {
        mobile_top_leaderboard: {
          sizes: [
            [320, 50],
          ],
        },
        mobile_in_content: {
          sizes: [
            [300, 250],
          ],
        },
        bottom_leaderboard: {
          sizes: [
            [320, 50],
            [300, 250],
          ],
        },
        floor_adhesion: {
          sizes: [
            [300, 50],
            [320, 50],
            [320, 100],
          ],
        },
        featured: {
          type: 'video',
        },
      },
    },
    prebid: {
      enabled: false,
      lazyLoadingEnabled: false,
      bidsRefreshing: {
        enabled: false,
        slots: ['mobile_in_content'],
      },
      '33across': {
        enabled: false,
        slots: {
          floor_adhesion: {
            sizes: [
              [300, 50],
              [320, 50],
              [320, 100],
            ],
            siteId: 'adXWum5iSr6z9AaKlId8sQ',
            productId: 'inview',
          },
        },
      },
      appnexus: {
        enabled: false,
        slots: {
          mobile_top_leaderboard: {
            sizes: [
              [320, 50],
            ],
          },
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
          },
          bottom_leaderboard: {
            sizes: [
              [300, 250],
              [320, 50],
            ],
          },
          floor_adhesion: {
            sizes: [
              [300, 50],
              [320, 50],
              [320, 100],
            ],
            placementId: '17062362',
          },
        },
        placements: {
          ent: '9412992',
          gaming: '9412993',
          life: '9412994',
          other: '9412994',
        },
      },
      appnexusAst: {
        enabled: false,
        debugPlacementId: '5768085',
        slots: {
          featured: {
            placementId: '13705871',
          },
          incontent_player: {
            placementId: '11543173',
          },
        },
      },
      beachfront: {
        enabled: false,
        debugAppId: '2e55f7ad-3558-49eb-a3e1-056ccd0e74e2',
        slots: {
          incontent_player: {
            appId: 'f377a8b1-c5c0-4108-f932-0102a81ff43d',
          },
        },
      },
      gumgum: {
        enabled: false,
        slots: {
          floor_adhesion: {
            sizes: [
              [300, 50],
              [320, 50],
              [320, 100],
            ],
            inScreen: 'vbzbl1nw',
          },
        },
      },
      indexExchange: {
        enabled: false,
        slots: {
          mobile_top_leaderboard: {
            sizes: [
              [320, 50],
            ],
            siteId: '183568',
          },
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
            siteId: '185055',
          },
          bottom_leaderboard: {
            sizes: [
              [300, 250],
              [320, 50],
            ],
            siteId: '185056',
          },
          floor_adhesion: {
            sizes: [
              [300, 50],
              [320, 50],
              [320, 100],
            ],
            siteId: '419027',
          },
          featured: {
            siteId: '437503',
          },
        },
      },
      kargo: {
        enabled: false,
        slots: {
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
            placementId: '_oMn9XHKEp3',
          },
          floor_adhesion: {
            sizes: [
              [320, 50],
            ],
            placementId: '_t6KTOnCSj5',
          },
        },
      },
      mediagrid: {
        enabled: false,
        slots: {
          featured: {
            uid: 46143,
          },
        },
      },
      nobid: {
        enabled: false,
        slots: {
          mobile_top_leaderboard: {
            sizes: [
              [320, 50],
            ],
            siteId: '21872987104',
          },
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
            siteId: '21872987104',
          },
          bottom_leaderboard: {
            sizes: [
              [320, 50],
            ],
            siteId: '21872987104',
          },
        },
      },
      oneVideo: {
        enabled: false,
        slots: {
          featured: {
            pubId: 'FandomIS',
          },
          incontent_player: {
            pubId: 'FandomOS',
          },
        },
      },
      openx: {
        enabled: false,
        delDomain: 'wikia-d.openx.net',
        slots: {
          mobile_top_leaderboard: {
            sizes: [
              [320, 50],
            ],
            unit: 538735698,
          },
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
            unit: 538735699,
          },
          bottom_leaderboard: {
            sizes: [
              [300, 250],
              [320, 50],
            ],
            unit: 538735700,
          },
        },
      },
      pubmatic: {
        enabled: false,
        publisherId: '156260',
        slots: {
          featured: {
            sizes: [
              [0, 0],
            ],
            ids: [
              '1636187@0x0',
            ],
          },
          incontent_player: {
            sizes: [
              [0, 0],
            ],
            ids: [
              '1636188@0x0',
            ],
          },
          mobile_top_leaderboard: {
            sizes: [
              [320, 50],
            ],
            ids: [
              '/5441/MOBILE_TOP_LEADERBOARD_320x50@320x50',
            ],
          },
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
            ids: [
              '/5441/MOBILE_IN_CONTENT_300x250@300x250',
              '/5441/MOBILE_IN_CONTENT_320x480@320x480',
            ],
          },
          bottom_leaderboard: {
            sizes: [
              [300, 250],
              [320, 50],
            ],
            ids: [
              '/5441/MOBILE_PREFOOTER_300x250@300x250',
              '/5441/MOBILE_PREFOOTER_320x50@320x50',
            ],
          },
        },
      },
      rubicon: {
        enabled: false,
        accountId: 7450,
        slots: {
          featured: {
            siteId: '147980',
            sizeId: '201',
            zoneId: '699374',
          },
          incontent_player: {
            siteId: '55412',
            sizeId: '203',
            zoneId: '563110',
          },
        },
      },
      rubicon_display: {
        enabled: false,
        accountId: 7450,
        slots: {
          mobile_top_leaderboard: {
            sizes: [
              [320, 50],
            ],
            position: 'atf',
            siteId: '23565',
            zoneId: '87671',
          },
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
            siteId: '23565',
            zoneId: '87671',
          },
          bottom_leaderboard: {
            sizes: [
              [300, 250],
              [320, 50],
            ],
            siteId: '23565',
            zoneId: '87671',
          },
          floor_adhesion: {
            sizes: [
              [300, 50],
              [320, 50],
              [320, 100],
            ],
            siteId: '23565',
            zoneId: '1422262',
          },
        },
      },
      telaria: {
        enabled: false,
        slots: {
          featured: {
            adCode: '2ciy2-doix6',
            supplyCode: '2ciy2-9kbup',
          },
        },
      },
      triplelift: {
        enabled: false,
        slots: {
          mobile_top_leaderboard: {
            sizes: [
              [320, 50],
            ],
            inventoryCodes: [
              'Fandom_MW_LB_320x50_hdx_prebid',
            ],
          },
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
            inventoryCodes: [
              'Fandom_Mobile_InContent_prebid',
            ],
          },
          bottom_leaderboard: {
            sizes: [
              [300, 250],
              [320, 50],
            ],
            inventoryCodes: [
              'Fandom_MW_PF_300x250_hdx_prebid',
              'Fandom_MW_PF_320x50_hdx_prebid',
            ],
          },
        },
      },
      verizon: {
        enabled: false,
        dcn: '8a9699f00175750d02821e07009101ea',
        slots: {
          mobile_top_leaderboard: {
            sizes: [[320, 50]],
            pos: 'mobile_top_leaderboard',
          },
          mobile_in_content: {
            sizes: [[300, 250]],
            pos: 'mobile_in_content',
          },
          bottom_leaderboard: {
            sizes: [[300, 250]],
            pos: 'bottom_leaderboard',
          },
        },
      },
      wikia: {
        enabled: false,
        slots: {
          mobile_top_leaderboard: {
            sizes: [
              [320, 50],
            ],
          },
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
          },
          bottom_leaderboard: {
            sizes: [
              [300, 250],
            ],
          },
          floor_adhesion: {
            sizes: [
              [320, 50],
            ],
          },
        },
      },
      wikiaVideo: {
        enabled: false,
        slots: {
          featured: {
            videoAdUnitId: '/5441/wka.life/_project43//article/test/outstream',
            customParams: 's1=_project43&artid=402&src=test&pos=outstream',
          },
          incontent_player: {
            videoAdUnitId: '/5441/wka.life/_project43//article/test/outstream',
            customParams: 's1=_project43&artid=402&src=test&pos=outstream',
          },
        },
      },
    },
  },
  custom: {
    dfpId: '5441',
    wikiIdentifier: '_not_a_top1k_wiki',
    wikiDBNameIdentifier: '_not_a_top1k_wiki',
  },
  events: {
    pushOnScroll: {
      ids: [],
      threshold: 100,
    },
    pushAfterRendered: {
      top_boxad: [
        'incontent_boxad_1',
        'incontent_player',
        'affiliate_slot',
      ],
    },
  },
  slots: {},
  vast: {
    adUnitId: '/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/'
   + '{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
    dbNameAdUnitId: '/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/'
      + '{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiDBNameIdentifier}-{targeting.s0}',
  },
  targeting: {
    ae3: '1',
    rollout_tracking: [],
    skin: 'mercury',
    uap: 'none',
  },
  templates: {
    safeFanTakeoverElement: {
      boxadSlotNames: ['top_boxad', 'mobile_prefooter'],
      boxadSize: [300, 251],
    },
  },
  services: {
    billTheLizard: {
      enabled: true,
      host: 'https://services.wikia.com',
      endpoint: 'bill-the-lizard/predict',
      projects: {},
      parameters: {},
      timeout: 2000,
    },
    confiant: {
      enabled: false,
      propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
    },
    durationMedia: {
      enabled: false,
    },
    externalLogger: {
      endpoint: '/wikia.php?controller=AdEngine&method=postLog',
    },
    instantConfig: {
      endpoint: 'https://services.wikia.com/icbm/api/config?app=mobile-wiki',
      fallback: fallbackInstantConfig,
    },
    iasPublisherOptimization: {
      pubId: '930616',
      slots: [
        'top_leaderboard',
        'top_boxad',
        'incontent_boxad_1',
        'bottom_leaderboard',
        'featured',
        'incontent_player',
      ],
    },
    nielsen: {
      enabled: false,
      appId: 'P26086A07-C7FB-4124-A679-8AC404198BA7',
    },
    realVu: {
      id: 'c=E6H4_f=mint',
      enabled: false,
    },
  },
  slotGroups: {
    VIDEO: ['ABCD', 'FEATURED', 'OUTSTREAM', 'UAP_BFAA', 'UAP_BFAB', 'VIDEO'],
  },
  src: 'mobile',
  state: {
    adStack: [],
    isMobile: true,
  },
  options: {
    customAdLoader: {
      globalMethodName: 'loadCustomAd',
    },
    video: {
      moatTracking: {
        articleVideosPartnerCode: 'wikiajwint101173217941',
        enabled: false,
        jwplayerPluginUrl: 'https://z.moatads.com/jwplayerplugin0938452/moatplugin.js',
        partnerCode: 'wikiaimajsint377461931603',
        sampling: 0,
      },
      iasTracking: {
        enabled: false,
        config: {
          anId: '930616',
          campId: '640x480',
        },
      },
      watchingThat: {
        apiKey: 'NnBNOWpNNUxFfGJGZkJQaHFCQndNc3ZPMXZQZEp5UkhCWEdPbGJvRllP',
        enabled: false,
      },
    },
    viewabilityCounter: {
      enabled: true,
      ignoredSlots: ['featured', 'incontent_player', 'video'],
    },
  },
};

export default defaultAdContext;
