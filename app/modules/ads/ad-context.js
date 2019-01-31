export default {
  adUnitId: '/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/'
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
      lkqd: {
        enabled: false,
        slots: {
          featured: {
            placementId: '523',
            siteId: '892127',
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
    wikiDBNameIdentifier: '_not_a_top1k_wiki',
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
    adUnitId: '/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/'
   + '{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
    dbNameAdUnitId: '/{custom.dfpId}/{custom.serverPrefix}1b.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/'
      + '{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiDBNameIdentifier}-{targeting.s0}',
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
    confiant: {
      enabled: false,
      propertyId: 'd-aIf3ibf0cYxCLB1HTWfBQOFEA',
      mapping: 'W3siaSI6MiwidCI6Int7b319Ont7d319eHt7aH19IiwicCI6MCwiRCI6MSwiciI6W119LHsiaSI6NiwidCI6Int7Y299fTp7e3d9fXh7e2h9fSIsInAiOjUwLCJEIjowLCJyIjpbeyJ0IjoiZXgiLCJzIjpudWxsLCJ2IjoiY28ifV19XQ==',
      activation: '|||NTE0MDEyODEy,|||MjMyNDM5OTQ1Ng==,|||MjE3ODQ2MTAzNw==,|||MjE3ODI5ODY4OA==,|||MjE3ODI4ODQzNA==,|||NTYxNjYzODUy,|||NTYxNjYxOTMy,|||NTYxNjYxNjky,|||NTYxNjYxMjEy,|||NTYxNjQ5Njky,|||NTYxNjQzNjky,|||MjM3OTQ1NTAyNg==,|||MjM3ODQ0NTk4Mw==,|||MjM3NTc1NjU5Mg==,|||MjEwODE2OTA4OA==,|||MjEwODI1NDQ3Mw==,|||MjA5NjcwNzY2NA==,|||MjA5NjY5MTk2MQ==,|||NTU0Njc2OTcy,|||NTU0Njc2NzMy,|||NTU1MTc5Nzcy,|||NTU1MDk5Mzcy,|||NTU1MDk4NjUy,|||NTU1MDk4NDEy,|||NTU1MDk4MTcy,|||NTU1MDk3OTMy,|||NTU0OTU4MjUy,|||NTU0OTU3NTMy,|||NTU0OTUzNDUy,|||NTU0OTEwOTcy,|||NTU0OTA4ODEy,|||MjEwODE3MTkyNg==,|||MjEwODI1OTk5Mw==,|||NTcyNzQ0NDEy,|||NTcyNzQzOTMy,|||NTcyNzQyNDky,|||NTcyNzQwMDky,|||NTcyNzM2NzMy,|||NTcyNzI5Mjky,|||NTcyNzI4ODEy,|||NTcyNzI4MzMy,|||NTcyNzI2ODky,|||NTcyNzIwODky,|||NTcyNzE4MjUy,|||MjM3OTYwOTAxMg==,|||MjM3OTA1NDY4Nw==,|||MjM3NTMxMDE1Ng==,|||MjEyMzQ4NTQzMQ==,|||MjEyMDIwNTAwMA==,|||MjEyMDI0MTA4Mw==,|||MjEyMDI0Njc3Nw==,|||MjEyMDI5NDA1Mg==,|||MjEyMDMxMzc1Mw==,|||MjEyMDM1MDc0NA==,|||MjEyMDQxOTY3Ng==,|||MjEyMDMxMDg4Mg==,|||MjEyMDI4NDA2Ng==,|||MjEyMDI4NDQ3NQ==,|||MjExOTg0MzY0OQ==,|||MjExOTc4NzI3MA==,|||MjExOTc1MzE2Mw==,|||NTczNDAxNTMy,|||NTczNDAwMzMy,|||NTU0NDk0MDky,|||NTU0NDkzODUy,|||NTU0NDkxNjky,|||NTU0NDkxNDUy,|||NTU0NDg4ODEy,|||NTU0NDgzMjky,|||NTU0MDQwOTcy,|||NTU0MDQwNzMy,|||NTUyODM4MDky,|||MjQzMzEyMTM1NA==,|||MjIxOTQxNzAxNA==,|||MjIxOTU5MDcxOQ==,|||MjIxODkwNDU3OQ==,|||MjIxOTE5MDM2Mw==,|||MjIxOTE4OTc0NQ==,|||MjE5MTAxNzMwMA==,|||MjE5MDc1MDE3OA==,|||MjE5MDczNTQ4Nw==,|||MjE5MDQ2NDU3NA==,|||MjE5MDQyNTkwOQ==,|||MjE5MDQ0MzQyNw==,|||MjE5MDM3OTY2NA==,|||MjE5MDA4ODA3Mg==,|||MjE4NzcxMzk2Mw==,|||NTQxMjQxNzcy,|||MjU2NzQ5NzMy,|||MjEzOTMwNzMy,|||NTY2MDAzNTMy,|||MjIyNTY0MDg0MA==,|||MjIyNTQzMzU4OQ==,|||MjI2MzMwNjkzNQ==,|||MjM1NjY5NTExNw==,|||NDY1NjU2NDEy,|||MjE0ODUxNjE1Mg==,|||MjEzMzI5MjY4Mg==,|||MjEzMzI4MTc1MQ==,|||MjEzMzI3OTk3Mg==,|||MjEzMzI3NDk5MQ==,|||MjEzMzI2NjEzMw==,|||MjEzMzI3MzI2Mw==,|||MjEzMzE2MzY1NA==,|||MjEzMjc4ODAyOA==,|||MjEzMjc4MTk5NQ==,|||MjEzMjc2NTcyMA==,|||MjEzMjczMDQyOQ==,|||MjEzMjcyODI4MA==,|||MjEzMTg4NjU5Mw==,|co|ex|MQ==',
    },
    geoEdge: {
      enabled: false,
      id: 'f45edc1b-ebdd-44bc-8157-a6fa6b829943',
      config: {
        advs: {
          120259452: true, // AOL
          115916532: true, // AppNexus
          115786212: true, // Index Exchange
          124353852: true, // OpenX
          4475752210: true, // Pubmatic
          48029772: true, // Rubicon
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
