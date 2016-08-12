import Ember from 'ember';
import Ads from 'common/modules/ads';

export default Ember.Mixin.create({
	adsData: {
		additionalConfig: {
			MOBILE_TOP_LEADERBOARD: {
				// ATF slot is pushed immediately (without any delay/in single request with other slots)
				isAboveTheFold: true
			},
			MOBILE_BOTTOM_LEADERBOARD: {
				disableManualInsert: true
			}
		},
		minZerothSectionLength: 700,
		minPageLength: 2000,
		mobileBottomLeaderBoard: 'MOBILE_BOTTOM_LEADERBOARD',
		mobileInContent: 'MOBILE_IN_CONTENT',
		mobilePreFooter: 'MOBILE_PREFOOTER',
		mobileTopLeaderBoard: 'MOBILE_TOP_LEADERBOARD',

		moreInContentAds: {
			// Disable the extra in content ads:
			enabled: false,

			// Only launch the ads on pages longer than:
			minPageLength: 5000,

			// Don't put ads too close to each other. Desired distance between ads + one ad height:
			minOffsetDiffBetweenAds: 1800,

			// Ad height + vertical margin:
			adHeight: 280,

			// Inject at max this many extra slots:
			maxSlots: 3,

			// ... and name them:
			slotNamePrefix: 'MOBILE_IN_CONTENT_EXTRA_'
		}
	},
	adViews: [],

	/**
	 * @param {string} adSlotName
	 * @param {string} place
	 * @param {JQuery} element
	 * @returns {void}
	 */
	appendAd(adSlotName, place, element) {
		const adsData = this.get('adsData'),
			component = this.get('container').lookup(`component:ad-slot`, {
				singleton: false
			}),
			config = adsData.additionalConfig[adSlotName] || {};

		component.setProperties({
			disableManualInsert: !!config.disableManualInsert,
			isAboveTheFold: !!config.isAboveTheFold,
			name: adSlotName,
			noAds: this.get('noAds')
		});

		const componentElement = this.createChildView(component).createElement();

		if (place === 'after') {
			componentElement.$().insertAfter(element);
		} else if (place === 'before') {
			componentElement.$().insertBefore(element);
		}

		this.adViews.push(componentElement);

		componentElement.didInsertElement();
		componentElement.onElementManualInsert();
	},

	/**
	 * @returns {void}
	 */
	clearAdViews() {
		let adView = this.adViews.pop();

		while (adView) {
			adView.destroyElement();
			adView = this.adViews.pop();
		}
	},

	/**
	 * Inject MOBILE_IN_CONTENT_EXTRA_* ads on selected wikis
	 *
	 * @returns {void}
	 */
	injectMoreInContentAds() {
		const config = this.adsData.moreInContentAds,
			minDistanceBetweenAds = config.minOffsetDiffBetweenAds,
			expectedAdHeight = config.adHeight,
			slotNamePrefix = config.slotNamePrefix,
			maxSlots = config.maxSlots,

			// Sorted list of top positions of ads:
			adPositions = [].concat(
				// MOBILE_TOP_LEADERBOARD:
				[0],
				// in content ads:
				this.adViews.map((adView) => adView.$().offset().top)
			),

			// Sorted list of top positions of headers:
			$headers = $('.article-content').find('> h2, > h3'),
			headerPositions = $headers.map(function () {
				return $(this).offset().top;
			}).get(),

			goodHeaders = [],

			headerLen = headerPositions.length,
			adLen = adPositions.length;

		let i = 0,
			adIndex = 0,
			adsToInject = 0;

		// Find headers to inject ads before
		while (i < headerLen && adIndex < adLen && adsToInject < maxSlots) {
			const prevAdPosition = adPositions[adIndex],
				nextAdPosition = adPositions[adIndex + 1],
				headerPosition = headerPositions[i];

			if (headerPosition < prevAdPosition + minDistanceBetweenAds) {
				// Header too close to previous ad
				i += 1;
			} else if (!nextAdPosition || nextAdPosition > headerPosition + minDistanceBetweenAds) {
				// Header is located in the safe spot between previous and next ad
				goodHeaders.push($headers.eq(i));
				adsToInject += 1;

				// Use the current header position as the current ad position
				// Subtract the ad height to make the calculations work for the next headers
				adPositions[adIndex] = headerPosition - expectedAdHeight;
			} else {
				// We need to find a header that's below the next ad, thus:
				adIndex += 1;
			}
		}

		// Inject the ads now
		for (i = 0; i < adsToInject; i += 1) {
			Ember.Logger.info(`Injecting an extra in content ad before ${goodHeaders[i].attr('id')}`);
			this.appendAd(slotNamePrefix + (i + 1), 'before', goodHeaders[i]);
		}

		if (!adsToInject) {
			Ember.Logger.info('The page is long, but no extra in content ads were injected');
		}
	},

	/**
	 * @returns {void}
	 */
	injectAds() {
		const $firstSection = this.$().children('h2').first(),
			$articleBody = $('.article-body'),
			$pi = $('.portable-infobox'),
			$pageHeader = $('.wiki-page-header'),
			adsData = this.get('adsData'),
			firstSectionTop = ($firstSection.length && $firstSection.offset().top) || 0,
			articleBodyHeight = $articleBody.height(),

			showInContent = firstSectionTop > adsData.minZerothSectionLength,
			showPreFooter = !showInContent || articleBodyHeight > adsData.minPageLength,
			showMoreInContentAds = adsData.moreInContentAds.enabled &&
				articleBodyHeight > adsData.moreInContentAds.minPageLength,

			$globalFooter = $('.wds-global-footer');

		this.clearAdViews();

		if ($pi.length) {
			// inject top mobileTopLeaderBoard below infobox
			this.appendAd(adsData.mobileTopLeaderBoard, 'after', $pi.first());
		} else if ($pageHeader.length) {
			// inject top mobileTopLeaderBoard below article header
			this.appendAd(adsData.mobileTopLeaderBoard, 'after', $pageHeader.first());
		}

		if (showInContent) {
			this.appendAd(adsData.mobileInContent, 'before', $firstSection);
		}

		if (showPreFooter) {
			this.appendAd(adsData.mobilePreFooter, 'after', $articleBody);
		}

		if (showMoreInContentAds) {
			this.injectMoreInContentAds();
		} else if (adsData.moreInContentAds.enabled) {
			Ember.Logger.info(`The page is not long enough for extra in content ads: ${articleBodyHeight}`);
		}

		if ($globalFooter.length) {
			this.appendAd(adsData.mobileBottomLeaderBoard, 'before', $globalFooter);
		}
	},

	/**
	 * Load ads for main page.
	 * InContent ad should be displayed below curated content only when it's available.
	 * Prefooter ad should be loaded above footer
	 * only when trending articles and/or trending videos are loaded.
	 *
	 * @returns {void}
	 */
	injectMainPageAds() {
		const $curatedContent = this.$('.curated-content'),
			$trendingArticles = this.$('.trending-articles'),
			showInContent = $curatedContent.length > 0,
			showPreFooter = $trendingArticles.length,
			$globalFooter = $('.wds-global-footer');

		this.clearAdViews();

		if (showInContent) {
			this.appendAd(this.adsData.mobileInContent, 'after', $curatedContent);
		}

		if (showPreFooter) {
			this.appendAd(this.adsData.mobilePreFooter, 'after', $trendingArticles);
		}

		if ($globalFooter.length) {
			this.appendAd(this.adsData.mobileBottomLeaderBoard, 'before', $globalFooter);
		}
	},

	/**
	 * @param {*} adsContext
	 * @returns {void}
	 */
	setupAdsContext(adsContext) {
		Ads.getInstance().reload(adsContext);
	}
});
