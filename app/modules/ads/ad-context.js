export default {
	adUnitId: '/{custom.dfpId}/wka.{targeting.s0}/{custom.wikiIdentifier}//{targeting.s2}/{src}/{slotConfig.slotName}',
	megaAdUnitId: '/{custom.dfpId}/wka1a.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.audioSegment}/' +
		'{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
	custom: {
		dfpId: '5441',
		wikiIdentifier: '_not_a_top1k_wiki'
	},
	events: {
		pushOnScroll: {
			ids: []
		},
		threshold: 100
	},
	listeners: {
		porvata: [],
		slot: []
	},
	slots: {},
	vast: {
		adUnitId: '/{custom.dfpId}/wka.{targeting.s0}/{custom.wikiIdentifier}//{targeting.s2}/{src}/{slotConfig.slotName}',
		megaAdUnitId: '/{custom.dfpId}/wka1a.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.audioSegment}/' +
			'{state.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}'
	},
	targeting: {
		outstream: 'none',
		skin: 'mercury',
		uap: 'none',
	},
	src: 'mobile',
	state: {
		adStack: [],
		isMobile: true
	},
	options: {
		customAdLoader: {
			globalMethodName: 'loadCustomAd'
		},
		video: {
			moatTracking: {
				enabled: false,
				partnerCode: 'wikiaimajsint377461931603',
				sampling: 0
			}
		},
		porvata: {
			audio: {
				exposeToSlot: true,
				segment: '-audio',
				key: 'audio'
			}
		},
		jwplayer: {
			audio: {
				exposeToSlot: true,
				segment: '-audio',
				key: 'audio'
			}
		}
	}
};
