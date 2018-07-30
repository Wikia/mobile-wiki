import { inject as service } from '@ember/service';
import Mixin from '@ember/object/mixin';
import { getRenderComponentFor } from '../utils/render-component';

export default Mixin.create({
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
	 * @param {string} waitKey
	 * @returns {void}
	 */
	appendAd(adSlotName, place, element, waitKey = '') {
		if (!this.get('ads.module').isSlotApplicable(adSlotName)) {
			return;
		}

		this.get('ads').getWaits(waitKey).then(() => {
			const placeholder = document.createElement('div');
			const attributes = this.get('ads.module').getAdSlotComponentAttributes(adSlotName);

			element.insertAdjacentElement(place, placeholder);

			attributes.pageHasFeaturedVideo = this.featuredVideo;

			this.ads.pushAdSlotComponent(adSlotName, this.renderAdComponent({
				name: 'ad-slot',
				attrs: attributes,
				element: placeholder
			}));
		});
		this.get('ads').clearWaits(adSlotName);
	},

	appendHighImpactAd() {
		const adsData = this.get('ads.slotNames'),
			placeholder = document.createElement('div'),
			wikiContainer = document.getElementById('wikiContainer');

		if (wikiContainer) {
			wikiContainer.insertAdjacentElement('afterend', placeholder);

			if (this.get('ads.module').isSlotApplicable(adsData.invisibleHighImpact2)) {
				this.ads.pushAdSlotComponent(
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
			adsData = this.get('ads.slotNames'),
			globalFooter = document.querySelector('.wds-global-footer'),
			slotsSwitched = this.adsContext.opts.preFooterAndBLBSwitched,
			afterArticleSlotName = slotsSwitched ? adsData.bottomLeaderBoard : adsData.mobilePreFooter,
			beforeFooterSlotName = slotsSwitched ? adsData.mobilePreFooter : adsData.bottomLeaderBoard;

		if (pi) {
			// inject top mobileTopLeaderBoard below infobox
			this.appendAd(adsData.mobileTopLeaderBoard, 'afterend', pi);
		} else if (pageHeader && !this.featuredVideo) {
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
			this.appendAd(afterArticleSlotName, 'beforebegin', articleFooter);
		}

		if (globalFooter) {
			this.appendAd(beforeFooterSlotName, 'beforebegin', globalFooter, 'RECIRCULATION_PREFOOTER');
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
		const adsData = this.get('ads.slotNames'),
			curatedContent = this.element.querySelector('.curated-content'),
			trendingArticles = this.element.querySelector('.trending-articles'),
			globalFooter = document.querySelector('.wds-global-footer'),
			slotsSwitched = this.adsContext.opts.preFooterAndBLBSwitched,
			afterArticleSlotName = slotsSwitched ? adsData.bottomLeaderBoard : adsData.mobilePreFooter,
			beforeFooterSlotName = slotsSwitched ? adsData.mobilePreFooter : adsData.bottomLeaderBoard;

		this.appendAd(adsData.mobileTopLeaderBoard, 'beforebegin', this.element);

		if (curatedContent) {
			this.appendAd(adsData.mobileInContent, 'afterend', curatedContent);
		}

		if (trendingArticles) {
			this.appendAd(afterArticleSlotName, 'afterend', trendingArticles);
		}

		if (globalFooter) {
			this.appendAd(beforeFooterSlotName, 'beforebegin', globalFooter, 'RECIRCULATION_PREFOOTER');
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
