import Ember from 'ember';

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
		invisibleHighImpact: 'INVISIBLE_HIGH_IMPACT',
		invisibleHighImpact2: 'INVISIBLE_HIGH_IMPACT_2',
		mobileBottomLeaderBoard: 'MOBILE_BOTTOM_LEADERBOARD',
		mobileInContent: 'MOBILE_IN_CONTENT',
		mobilePreFooter: 'MOBILE_PREFOOTER',
		mobileTopLeaderBoard: 'MOBILE_TOP_LEADERBOARD',
	},
	ads: Ember.inject.service(),

	/**
	 * @param {string} adSlotName
	 * @param {string} place
	 * @param {jQuery} element
	 * @returns {void}
	 */
	appendAd(adSlotName, place, element) {
		const adsData = this.get('adsData'),
			config = adsData.additionalConfig[adSlotName] || {},
			$placeholder = $('<div>');

		if (place === 'after') {
			$placeholder.insertAfter(element);
		} else if (place === 'before') {
			$placeholder.insertBefore(element);
		}

		this.get('ads').pushAdSlotComponent(adSlotName, this.renderComponent({
			name: 'ad-slot',
			attrs: {
				disableManualInsert: !!config.disableManualInsert,
				isAboveTheFold: !!config.isAboveTheFold,
				name: adSlotName
			},
			element: $placeholder.get(0)
		}));
	},

	appendHighImpactAd() {
		const $placeholder = $('<div>'),
			$wikiContainer = $('#wikiContainer');

		$placeholder.insertAfter($wikiContainer);

		this.get('ads').pushAdSlotComponent(
			this.get('adsData.invisibleHighImpact2'),
			this.renderComponent({
				name: 'ads/invisible-high-impact-2',
				attrs: {},
				element: $placeholder.get(0)
			})
		);

		this.appendAd(this.get('adsData.invisibleHighImpact'), 'after', $wikiContainer);
	},

	/**
	 * @returns {void}
	 */
	injectAds() {
		const $firstSection = this.$().children('h2').first(),
			$articleBody = $('.article-body'),
			$articleFooter = $('.article-footer'),
			$pi = $('.portable-infobox'),
			$pageHeader = $('.wiki-page-header'),
			adsData = this.get('adsData'),
			firstSectionTop = ($firstSection.length && $firstSection.offset().top) || 0,
			articleBodyHeight = $articleBody.height(),

			showInContent = firstSectionTop > adsData.minZerothSectionLength,
			showPreFooter = !showInContent || articleBodyHeight > adsData.minPageLength,
			$globalFooter = $('.wds-global-footer');

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
			this.appendAd(adsData.mobilePreFooter, 'before', $articleFooter);
		}

		if ($globalFooter.length) {
			this.appendAd(adsData.mobileBottomLeaderBoard, 'before', $globalFooter);
		}

		this.appendHighImpactAd();
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

		if (showInContent) {
			this.appendAd(this.adsData.mobileInContent, 'after', $curatedContent);
		}

		if (showPreFooter) {
			this.appendAd(this.adsData.mobilePreFooter, 'after', $trendingArticles);
		}

		if ($globalFooter.length) {
			this.appendAd(this.adsData.mobileBottomLeaderBoard, 'before', $globalFooter);
		}

		this.appendHighImpactAd();
	},

	/**
	 * @param {*} adsContext
	 * @returns {void}
	 */
	setupAdsContext(adsContext) {
		this.get('ads.module').reload(adsContext);
	}
});
