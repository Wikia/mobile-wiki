export default {
	getContext() {
		return {
			'top-leaderboard': {
				aboveTheFold: true,
				group: 'LB',
				options: {},
				slotName: 'MOBILE_TOP_LEADERBOARD',
				slotShortcut: 'l',
				sizes: [],
				defaultSizes: [[2, 2], [320, 50], [300, 250], [300, 50]],
				targeting: {
					loc: 'top'
				}
			},
			'incontent-boxad': {
				group: 'HiVi',
				options: {},
				slotName: 'MOBILE_IN_CONTENT',
				slotShortcut: 'i',
				sizes: [],
				defaultSizes: [[320, 50], [300, 250], [300, 50], [320, 480]],
				targeting: {
					loc: 'middle'
				}
			},
			'bottom-boxad': {
				disabled: true,
				group: 'PF',
				options: {},
				slotName: 'MOBILE_PREFOOTER',
				slotShortcut: 'p',
				sizes: [],
				defaultSizes: [[320, 50], [300, 250], [300, 50]],
				targeting: {
					loc: 'footer'
				}
			},
			'bottom-leaderboard': {
				group: 'PF',
				options: {},
				slotName: 'BOTTOM_LEADERBOARD',
				slotShortcut: 'b',
				sizes: [
					{
						viewportSize: [375, 627],
						sizes: [[300, 50], [320, 50], [300, 250], [300, 600]]
					}
				],
				defaultSizes: [[2, 2], [320, 50], [300, 250], [300, 50]],
				targeting: {
					pos: ['BOTTOM_LEADERBOARD', 'MOBILE_PREFOOTER'],
					loc: 'footer'
				}
			},
			'featured-video': {
				audioSegment: '',
				nonUapSlot: true,
				group: 'VIDEO',
				slotName: 'FEATURED',
				lowerSlotName: 'featured',
				targeting: {
					uap: 'none',
				},
				trackingKey: 'featured-video',
			},
			'inline-video': {
				audioSegment: '',
				nonUapSlot: true,
				group: 'VIDEO',
				slotName: 'VIDEO',
				lowerSlotName: 'video',
				targeting: {
					uap: 'none',
				},
				trackingKey: 'video',
			},
		};
	}
};
