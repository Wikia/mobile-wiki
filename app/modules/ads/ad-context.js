export default {
  adUnitId: '/{custom.dfpId}/wka.{targeting.s0}/{custom.wikiIdentifier}//{targeting.s2}/{src}/{slotConfig.slotName}',
  megaAdUnitId: '/{custom.dfpId}/wka1b.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/'
  + '{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
  bidders: {
    enabled: false,
    timeout: 2000,
    a9: {
      amazonId: '3115',
      bidsRefreshing: {
        enabled: false,
        slots: [],
      },
      dealsEnabled: false,
      enabled: false,
      videoEnabled: false,
      slots: {
        mobile_top_leaderboard: {
          slotId: 'MOBILE_TOP_LEADERBOARD',
          sizes: [
            [320, 50],
          ],
        },
        bottom_leaderboard: {
          slotId: 'BOTTOM_LEADERBOARD',
          sizes: [
            [320, 50],
            [300, 250],
          ],
        },
        featured: {
          slotId: 'FEATURED',
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
      aol: {
        enabled: false,
        network: '9435.1',
        slots: {
          mobile_top_leaderboard: {
            sizes: [
              [320, 50],
            ],
            placement: '4436772',
            alias: '4436772',
            sizeId: '3055',
          },
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
            placement: '4431565',
            alias: '4431565',
            sizeId: '170',
          },
          bottom_leaderboard: {
            sizes: [
              [300, 250],
            ],
            placement: '4431566',
            alias: '4431566',
            sizeId: '170',
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
      audienceNetwork: {
        enabled: false,
        slots: {
          mobile_top_leaderboard: {
            sizes: [
              [320, 50],
            ],
            placementId: '963689110376230_1245837502161388',
          },
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
            placementId: '963689110376230_1245838625494609',
          },
          bottom_leaderboard: {
            sizes: [
              [300, 250],
            ],
            placementId: '963689110376230_1245839585494513',
          },
        },
      },
      beachfront: {
        enabled: false,
        debugAppId: '2e55f7ad-3558-49eb-a3e1-056ccd0e74e2',
        slots: {
          mobile_in_content: {
            appId: 'f377a8b1-c5c0-4108-f932-0102a81ff43d',
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
        },
      },
      kargo: {
        enabled: false,
        slots: {
          mobile_in_content: {
            sizes: [
              [300, 250],
            ],
            placementId: '_cGWUgEUv0T',
          },
        },
      },
      onemobile: {
        enabled: false,
        siteId: '2c9d2b50015e5e9a6540a64f3eac0266',
        slots: {
          mobile_top_leaderboard: {
            size: [320, 50],
            pos: 'wikia_mw_top_leaderboard_hb',
          },
          mobile_in_content: {
            size: [300, 250],
            pos: 'wikia_mw_incontent_hb',
          },
          bottom_leaderboard: {
            size: [300, 250],
            pos: 'wikia_mw_pre_footer_hb',
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
            position: 'btf',
          },
          incontent_player: {
            siteId: '55412',
            sizeId: '203',
            zoneId: '563110',
            position: 'btf',
          },
        },
      },
      rubiconDisplay: {
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
            position: 'btf',
            siteId: '23565',
            zoneId: '87671',
          },
          bottom_leaderboard: {
            sizes: [
              [300, 250],
              [320, 50],
            ],
            position: 'btf',
            siteId: '23565',
            zoneId: '87671',
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
        },
      },
      wikiaVideo: {
        enabled: false,
        slots: {
          featured: {
            videoAdUnitId: '/5441/wka.life/_project43//article/test/outstream',
            customParams: 's1=_project43&artid=402&src=test&pos=outstream&passback=wikiaVideo',
          },
          incontent_player: {
            videoAdUnitId: '/5441/wka.life/_project43//article/test/outstream',
            customParams: 's1=_project43&artid=402&src=test&pos=outstream&passback=wikiaVideo',
          },
        },
      },
    },
  },
  custom: {
    dfpId: '5441',
    wikiIdentifier: '_not_a_top1k_wiki',
    appnexusDfp: true,
    rubiconDfp: true,
    pubmaticDfp: false,
  },
  events: {
    pushOnScroll: {
      ids: [],
      threshold: 100,
    },
    pushAfterRendered: {
      incontent_boxad_1: [
        'incontent_player',
      ],
    },
  },
  listeners: {
    porvata: [],
    slot: [],
  },
  slots: {},
  vast: {
    adUnitId: '/{custom.dfpId}/wka.{targeting.s0}/{custom.wikiIdentifier}//{targeting.s2}/{src}/{slotConfig.slotName}',
    megaAdUnitId: '/{custom.dfpId}/wka1b.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/'
   + '{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
  },
  targeting: {
    ae3: '1',
    outstream: 'none',
    skin: 'mercury',
    uap: 'none',
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
    geoEdge: {
      enabled: false,
      id: 'f45edc1b-ebdd-44bc-8157-a6fa6b829943',
      config: {
        advs: {
          115916532: true, // AppNexus
          124353852: true, // OpenX
          4475752210: true, // Pubmatic
        },
      },
    },
    krux: {
      enabled: false,
      id: 'JTKzTN3f',
    },
    moatYi: {
      enabled: false,
      partnerCode: 'wikiaprebidheader490634422386',
    },
    nielsen: {
      enabled: false,
      appId: 'P26086A07-C7FB-4124-A679-8AC404198BA7',
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
    },
  },
};
