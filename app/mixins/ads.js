import {inject as service} from '@ember/service';
import Mixin from '@ember/object/mixin';
import {getRenderComponentFor} from '../utils/render-component';

export default Mixin.create({
	adsData: {
		bottomLeaderBoard: 'BOTTOM_LEADERBOARD',
		invisibleHighImpact: 'INVISIBLE_HIGH_IMPACT',
		invisibleHighImpact2: 'INVISIBLE_HIGH_IMPACT_2',
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
	 * @param {Element} element
	 * @returns {void}
	 */
	appendAd(adSlotName, place, element) {
		if (!this.get('ads.module').isSlotApplicable(adSlotName)) {
			return;
		}

		const placeholder = document.createElement('div');
		const attributes = this.get('ads.module').getAdSlotComponentAttributes(adSlotName);

		element.insertAdjacentElement(place, placeholder);

		attributes.pageHasFeaturedVideo = this.get('featuredVideo');

		this.get('ads').pushAdSlotComponent(adSlotName, this.renderAdComponent({
			name: 'ad-slot',
			attrs: attributes,
			element: placeholder
		}));
	},

	appendHighImpactAd() {
		const adsData = this.get('adsData'),
			placeholder = document.createElement('div'),
			wikiContainer = document.getElementById('wikiContainer');

		if (wikiContainer) {
			wikiContainer.insertAdjacentElement('afterend', placeholder);

			if (this.get('ads.module').isSlotApplicable(adsData.invisibleHighImpact2)) {
				this.get('ads').pushAdSlotComponent(
					adsData.invisibleHighImpact2,
					this.renderAdComponent({
						name: 'ads/invisible-high-impact-2',
						attrs: {},
						element: placeholder
					})
				);
			}

			this.appendAd(adsData.invisibleHighImpact, 'afterend', wikiContainer);
		}
	},

	/**
	 * @returns {void}
	 */
	injectAds() {
		const firstSection = this.element.parentNode.querySelector('.article-content > h2'),
			articleFooter = document.querySelector('.article-footer'),
			pi = document.querySelector('.portable-infobox'),
			pageHeader = document.querySelector('.wiki-page-header'),
			adsData = this.get('adsData'),
			globalFooter = document.querySelector('.wds-global-footer');

		if (pi) {
			// inject top mobileTopLeaderBoard below infobox
			this.appendAd(adsData.mobileTopLeaderBoard, 'afterend', pi);
		} else if (pageHeader && !this.get('featuredVideo')) {
			// inject top mobileTopLeaderBoard below article header
			// only if there is no featured video embedded
			this.appendAd(adsData.mobileTopLeaderBoard, 'afterend', pageHeader);
		} else {
			this.get('ads.module').finishAtfQueue();
		}

		if (firstSection) {
			this.appendAd(adsData.mobileInContent, 'beforebegin', firstSection);
		}

		if (articleFooter) {
			this.appendAd(adsData.mobilePreFooter, 'beforebegin', articleFooter);
		}

		if (globalFooter) {
			this.appendAd(adsData.bottomLeaderBoard, 'beforebegin', globalFooter);
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
			curatedContent = this.element.querySelector('.curated-content'),
			trendingArticles = this.element.querySelector('.trending-articles'),
			globalFooter = document.querySelector('.wds-global-footer');

		this.appendAd(adsData.mobileTopLeaderBoard, 'beforebegin', this.element);

		if (curatedContent) {
			this.appendAd(adsData.mobileInContent, 'afterend', curatedContent);
		}

		if (trendingArticles) {
			this.appendAd(adsData.mobilePreFooter, 'afterend', trendingArticles);
		}

		if (globalFooter) {
			this.appendAd(adsData.bottomLeaderBoard, 'beforebegin', globalFooter);
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
		this.get('ads.module').afterTransition(adsContext);
	}
});
