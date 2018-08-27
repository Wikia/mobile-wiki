export default {
	adUnitId: '/{custom.dfpId}/wka.{targeting.s0}/{custom.wikiIdentifier}//{targeting.s2}/{src}/{slotConfig.slotName}',
	megaAdUnitId: '/{custom.dfpId}/wka1a.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/'
		+ '{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
	bidders: {
		enabled: false,
		timeout: 2000,
		a9: {
			enabled: false,
			videoEnabled: false,
			amazonId: '3115',
			slots: {
				mobile_top_leaderboard: [
					[320, 50],
				],
				mobile_in_content: [
					[300, 250],
					[320, 480],
				],
				bottom_leaderboard: [
					[320, 50],
					[300, 250],
				],
			},
			slotsVideo: ['featured'],
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
					mobile_in_content: {
						placementId: '11543173',
					},
				},
			},
			appnexusWebads: {
				enabled: false,
				slots: {
					mobile_top_leaderboard: {
						placementId: '13104396',
						sizes: [
							[320, 50],
						],
					},
					mobile_in_content: {
						placementId: '13104397',
						sizes: [
							[300, 250],
							[320, 100],
							[320, 50],
						],
					},
					bottom_leaderboard: {
						placementId: '13104398',
						sizes: [
							[300, 250],
							[320, 100],
							[320, 50],
						],
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
							[320, 480],
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
							[320, 480],
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
							[320, 480],
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
					mobile_in_content: {
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
					featured: {},
					mobile_in_content: {},
				},
			},
		},
	},
	custom: {
		dfpId: '5441',
		wikiIdentifier: '_not_a_top1k_wiki',
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
		megaAdUnitId: '/{custom.dfpId}/wka1a.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.slotNameSuffix}/'
			+ '{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
	},
	targeting: {
		outstream: 'none',
		skin: 'mercury',
		uap: 'none',
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
				enabled: false,
				partnerCode: 'wikiaimajsint377461931603',
				sampling: 0,
			},
		},
		porvata: {
			audio: {
				exposeToSlot: true,
				segment: '-audio',
				key: 'audio',
			},
		},
	},
};
