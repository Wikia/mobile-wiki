import {inject as service} from '@ember/service';
import Mixin from '@ember/object/mixin';
import {getRenderComponentFor} from '../utils/render-component';

export default Mixin.create({
	adsData: {
		additionalConfig: {
			MOBILE_TOP_LEADERBOARD: {
				// ATF slot is pushed immediately (without any delay/in single request with other slots)
				isAboveTheFold: true
			},
			MOBILE_BOTTOM_LEADERBOARD: {
				// disableManualInsert: true
			}
		},
		invisibleHighImpact: 'INVISIBLE_HIGH_IMPACT',
		invisibleHighImpact2: 'INVISIBLE_HIGH_IMPACT_2',
		mobileBottomLeaderBoard: 'MOBILE_BOTTOM_LEADERBOARD',
		mobileInContent: 'MOBILE_IN_CONTENT',
		mobilePreFooter: 'MOBILE_PREFOOTER',
		mobileTopLeaderBoard: 'MOBILE_TOP_LEADERBOARD'
	},
	ads: service(),
	currentUser: service(),

	init() {
		this._super(...arguments);
		this.renderAdComponent = getRenderComponentFor(this);
	},

	/**
	 * @param {string} adSlotName
	 * @param {string} place
	 * @param {jQuery} element
	 * @returns {void}
	 */
	appendAd(adSlotName, place, element) {
		if (!this.get('ads.module').isSlotApplicable(adSlotName)) {
			return;
		}

		const adsData = this.get('adsData'),
			config = adsData.additionalConfig[adSlotName] || {},
			$placeholder = $('<div>');

		if (place === 'after') {
			$placeholder.insertAfter(element);
		} else if (place === 'before') {
			$placeholder.insertBefore(element);
		}

		this.get('ads').pushAdSlotComponent(adSlotName, this.renderAdComponent({
			name: 'ad-slot',
			attrs: {
				disableManualInsert: !!config.disableManualInsert,
				pageHasFeaturedVideo: this.get('featuredVideo'),
				isAboveTheFold: !!config.isAboveTheFold,
				name: adSlotName
			},
			element: $placeholder.get(0)
		}));
	},

	appendHighImpactAd() {
		const $placeholder = $('<div>'),
			$wikiContainer = $('#wikiContainer');

		if ($wikiContainer.length) {
			$placeholder.insertAfter($wikiContainer);

			if (this.get('ads.module').isSlotApplicable(this.get('adsData.invisibleHighImpact2'))) {
				this.get('ads').pushAdSlotComponent(
					this.get('adsData.invisibleHighImpact2'),
					this.renderAdComponent({
						name: 'ads/invisible-high-impact-2',
						attrs: {},
						element: $placeholder.get(0)
					})
				);
			}


			this.appendAd(this.get('adsData.invisibleHighImpact'), 'after', $wikiContainer);
		}
	},

	/**
	 * @returns {void}
	 */
	injectAds() {
		const $firstSection = this.$().children('h2').first(),
			$articleFooter = $('.article-footer'),
			$pi = $('.portable-infobox'),
			$pageHeader = $('.wiki-page-header'),
			adsData = this.get('adsData'),
			$globalFooter = $('.wds-global-footer');

		if ($pi.length) {
			// inject top mobileTopLeaderBoard below infobox
			this.appendAd(adsData.mobileTopLeaderBoard, 'after', $pi.first());
		} else if ($pageHeader.length && !this.get('featuredVideo')) {
			// inject top mobileTopLeaderBoard below article header
			// only if there is no featured video embedded
			this.appendAd(adsData.mobileTopLeaderBoard, 'after', $pageHeader.first());
		}

		if ($firstSection.length > 0) {
			this.appendAd(adsData.mobileInContent, 'before', $firstSection);
		}

		if ($articleFooter.length > 0) {
			this.appendAd(adsData.mobilePreFooter, 'before', $articleFooter);
		}

		if ($globalFooter.length > 0) {
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
		const adsData = this.get('adsData'),
			$curatedContent = this.$('.curated-content'),
			$trendingArticles = this.$('.trending-articles'),
			$globalFooter = $('.wds-global-footer');

		if ($curatedContent.length > 0) {
			this.appendAd(adsData.mobileInContent, 'after', $curatedContent);
		}

		if ($trendingArticles.length > 0) {
			this.appendAd(adsData.mobilePreFooter, 'after', $trendingArticles);
		}

		if ($globalFooter.length > 0) {
			this.appendAd(adsData.mobileBottomLeaderBoard, 'before', $globalFooter);
		}

		this.appendHighImpactAd();
	},

	/**
	 * @param {*} adsContext
	 * @returns {void}
	 */
	setupAdsContext(adsContext) {
		adsContext.user = {
			isAuthenticated: this.get('currentUser.isAuthenticated')
		};
		this.get('ads.module').reloadAfterTransition(adsContext);
	}
});
