window.adsQueue = window.adsQueue || [];

export default {
	adUnitId: '/{custom.dfpId}/wka.{targeting.s0}/{custom.wikiIdentifier}//{targeting.s2}/{src}/{slotConfig.slotName}',
	megaAdUnitId: '/{custom.dfpId}/wka1a.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.audioSegment}/' +
		'{custom.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}',
	custom: {
		dfpId: '5441',
	},
	events: {},
	listeners: {
		porvata: [],
		slot: []
	},
	slots: {},
	vast: {
		adUnitId: '/{custom.dfpId}/wka.{targeting.s0}/{custom.wikiIdentifier}//{targeting.s2}/{src}/{slotConfig.slotName}',
		megaAdUnitId: '/{custom.dfpId}/wka1a.{slotConfig.group}/{slotConfig.adProduct}{slotConfig.audioSegment}/' +
			'{custom.deviceType}/{targeting.skin}-{targeting.s2}/{custom.wikiIdentifier}-{targeting.s0}'
	},
	targeting: {
		outstream: 'none',
		skin: 'mercury',
		uap: 'none',
	},
	src: 'mobile',
	state: {
		adStack: window.adsQueue,
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
