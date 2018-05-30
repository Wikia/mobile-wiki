import offset from '../../utils/offset';

const MIN_ZEROTH_SECTION_LENGTH = 700;
const MIN_NUMBER_OF_SECTIONS = 4;
const PAGE_TYPES = {
	article: 'a',
	home: 'h'
};

function setSlotState(slotName, state) {
	const {slotService} = window.Wikia.adEngine;

	if (state) {
		slotService.enable(slotName);
	} else {
		slotService.disable(slotName);
	}
}

function isTopLeaderboardApplicable() {
	const {context} = window.Wikia.adEngine;

	const hasFeaturedVideo = context.get('custom.hasFeaturedVideo'),
		isHome = context.get('custom.pageType') === 'home',
		hasPageHeader = !!document.querySelector('.wiki-page-header'),
		hasPortableInfobox = !!document.querySelector('.portable-infobox');

	return isHome || hasPortableInfobox || (hasPageHeader > 0 && !hasFeaturedVideo);
}

function isInContentApplicable() {
	const {context} = window.Wikia.adEngine;

	if (context.get('custom.pageType') === 'home') {
		return !!document.querySelector('.curated-content');
	}

	const firstSection = document.querySelector('.article-content > h2'),
		firstSectionTop = (
			firstSection &&
			offset(firstSection).top
		) || 0;

	return firstSectionTop > MIN_ZEROTH_SECTION_LENGTH;
}

function isPrefooterApplicable(isInContentApplicable) {
	const {context} = window.Wikia.adEngine;

	if (context.get('custom.pageType') === 'home') {
		return !!document.querySelector('.trending-articles');
	}

	const numberOfSections = document.querySelectorAll('.article-content > h2').length,
		hasArticleFooter = !!document.querySelector('.article-footer');

	return hasArticleFooter && !isInContentApplicable || numberOfSections > MIN_NUMBER_OF_SECTIONS;
}

function isBottomLeaderboardApplicable() {
	return !!document.querySelector('.wds-global-footer');
}

export default {
	getContext() {
		return {
			mobile_top_leaderboard: {
				aboveTheFold: true,
				adProduct: 'mobile_top_leaderboard',
				audioSegment: '',
				group: 'LB',
				options: {},
				slotShortcut: 'l',
				sizes: [],
				defaultSizes: [[320, 50], [320, 100], [300, 50]], // Add [2, 2] for UAP
				targeting: {
					loc: 'top',
					rv: 1
				}
			},
			mobile_in_content: {
				adProduct: 'mobile_in_content',
				audioSegment: '',
				group: 'HiVi',
				options: {},
				slotShortcut: 'i',
				sizes: [],
				defaultSizes: [[320, 50], [300, 250], [300, 50], [320, 480]],
				targeting: {
					loc: 'middle',
					rv: 1
				}
			},
			incontent_boxad_1: {
				adProduct: 'incontent_boxad_1',
				audioSegment: '',
				group: 'HiVi',
				options: {},
				repeat: {
					additionalClasses: 'hide',
					index: 1,
					insertBeforeSelector: '.article-body h2',
					limit: null,
					slotNamePattern: 'incontent_boxad_{slotConfig.repeat.index}',
					updateProperties: {
						'adProduct': '{slotConfig.slotName}',
						'targeting.rv': '{slotConfig.repeat.index}'
					}
				},
				slotShortcut: 'f',
				sizes: [
					{
						viewportSize: [375, 627],
						sizes: [[300, 50], [320, 50], [300, 250], [300, 600]]
					}
				],
				defaultSizes: [[320, 50], [300, 250], [300, 50]],
				targeting: {
					loc: 'middle',
					pos: ['INCONTENT_BOXAD', 'MOBILE_IN_CONTENT'],
					rv: 1
				}
			},
			mobile_prefooter: {
				adProduct: 'mobile_prefooter',
				audioSegment: '',
				disabled: true,
				disableManualInsert: true,
				group: 'PF',
				options: {},
				slotShortcut: 'p',
				sizes: [],
				defaultSizes: [[320, 50], [300, 250], [300, 50]],
				targeting: {
					loc: 'footer',
					rv: 1
				}
			},
			bottom_leaderboard: {
				adProduct: 'bottom_leaderboard',
				audioSegment: '',
				group: 'PF',
				options: {},
				slotShortcut: 'b',
				sizes: [
					{
						viewportSize: [375, 627],
						sizes: [[300, 50], [320, 50], [300, 250], [300, 600]]
					}
				],
				defaultSizes: [[320, 50], [300, 250], [300, 50]], // Add [2, 2] for UAP
				targeting: {
					loc: 'footer',
					pos: ['BOTTOM_LEADERBOARD', 'MOBILE_PREFOOTER'],
					rv: 1
				}
			},
			featured: {
				adProduct: 'featured',
				audioSegment: '',
				nonUapSlot: true,
				group: 'VIDEO',
				lowerSlotName: 'featured',
				targeting: {
					uap: 'none',
				},
				trackingKey: 'featured-video',
			},
			video: {
				adProduct: 'video',
				audioSegment: '',
				nonUapSlot: true,
				group: 'VIDEO',
				lowerSlotName: 'video',
				targeting: {
					uap: 'none',
				},
				trackingKey: 'video',
			},
		};
	},

	setupStates() {
		const {context} = window.Wikia.adEngine;

		const incontentState = isInContentApplicable();

		setSlotState('MOBILE_TOP_LEADERBOARD', isTopLeaderboardApplicable());
		setSlotState('MOBILE_IN_CONTENT', incontentState);
		setSlotState('MOBILE_PREFOOTER', isPrefooterApplicable(incontentState));
		setSlotState('BOTTOM_LEADERBOARD', isBottomLeaderboardApplicable());
		setSlotState('FEATURED', context.get('custom.hasFeaturedVideo'));
	},

	setupIdentificators() {
		const {context} = window.Wikia.adEngine;

		const pageTypeParam = PAGE_TYPES[context.get('targeting.s2')] || 'x';
		const slotsDefinition = context.get('slots');

		// Wikia Page Identificator
		context.set('targeting.wsi', `mx${pageTypeParam}1`);
		Object.keys(slotsDefinition).forEach((key) => {
			const slotParam = slotsDefinition[key].slotShortcut || 'x';
			context.set(`slots.${key}.targeting.wsi`, `m${slotParam}${pageTypeParam}1`);
		});
	}
};
