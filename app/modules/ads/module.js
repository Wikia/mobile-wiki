import {Promise} from 'rsvp';
import adsSetup from './setup';
import adBlockDetection from './tracking/adblock-detection';
import videoAds from '../video-players/video-ads';

const SLOT_NAME_MAP = {
	MOBILE_TOP_LEADERBOARD: 'top-leaderboard',
	MOBILE_IN_CONTENT: 'incontent-boxad',
	MOBILE_PREFOOTER: 'bottom-boxad',
	BOTTOM_LEADERBOARD: 'bottom-leaderboard'
};

class Ads {
	constructor() {
		this.instantGlobals = null;
		this.engine = null;
		this.events = null;
		this.isLoaded = false;
		this.onReadyCallbacks = [];
		this.jwPlayerMoat = videoAds.jwPlayerMOAT;
	}

	static getInstance() {
		if (Ads.instance === null) {
			Ads.instance = new Ads();
		}
		return Ads.instance;
	}

	static loadGoogleTag() {
		window.M.loadScript('//www.googletagservices.com/tag/js/gpt.js', true);
	}

	setupAdEngine(mediaWikiAdsContext, instantGlobals) {
		const {events} = window.Wikia.adEngine;

		adsSetup.configure(mediaWikiAdsContext, instantGlobals);
		this.instantGlobals = instantGlobals;
		this.events = events;
		this.events.registerEvent('MENU_OPEN_EVENT');
		this.engine = adsSetup.init();

		this.isLoaded = true;
		this.onReadyCallbacks.forEach((callback) => callback());
		this.onReadyCallbacks = [];

		Ads.loadGoogleTag();
	}

	init(mediaWikiAdsContext = {}) {
		if (!this.isLoaded && (!mediaWikiAdsContext.user || !mediaWikiAdsContext.user.isAuthenticated)) {
			this.getInstantGlobals()
				.then(instantGlobals => {
					M.trackingQueue.push(() => this.setupAdEngine(mediaWikiAdsContext, instantGlobals));
				});
		}

	}

	finishAtfQueue() {
		const {btfBlockerService} = window.Wikia.adEngine;

		btfBlockerService.finishAboveTheFold();
	}

	getInstantGlobals() {
		return new Promise((resolve) => window.getInstantGlobals(resolve));
	}

	onReady(callback) {
		if (this.isLoaded) {
			callback();
		} else {
			this.onReadyCallbacks.push(callback);
		}
	}

	isSlotApplicable(slotName) {
		return !!SLOT_NAME_MAP[slotName];
	}

	getAdSlotComponentAttributes(slotName) {
		const {context} = window.Wikia.adEngine;

		const name = SLOT_NAME_MAP[slotName] || slotName;
		const slotDefinition = context.get(`slots.${name}`);

		return {
			disableManualInsert: slotDefinition.disableManualInsert,
			isAboveTheFold: slotDefinition.aboveTheFold,
			name: `gpt-${name}`,
			hiddenClassName: 'hide'
		};
	}

	isArticleSectionCollapsed() {
		const {context} = window.Wikia.adEngine;

		return context.get('options.mobileSectionsCollapse');
	}

	pushSlotToQueue(name) {
		const {context} = window.Wikia.adEngine;
		const slotId = SLOT_NAME_MAP[name] ? `gpt-${SLOT_NAME_MAP[name]}` : name;

		context.push('state.adStack', {id: slotId});
	}

	onTransition(options) {
		const defaultOptions = {
			doNotDestroyGptSlots: true // allow mobile-wiki to destroy GPT slots on one's own
		};

		if (this.events) {
			this.events.pageChange(Object.assign(defaultOptions, options));
		}
	}

	afterTransition(mediaWikiAdsContext, instantGlobals) {
		this.instantGlobals = instantGlobals || this.instantGlobals;
		adBlockDetection.track();

		if (this.events) {
			this.events.pageRender({
				adContext: mediaWikiAdsContext,
				instantGlobals: this.instantGlobals
			});
		}
	}

	removeSlot(name) {
		const gptProvider = this.engine.getProvider('gpt');

		if (gptProvider) {
			gptProvider.destroySlots([name]);
		}
	}

	waitForReady() {
		return new Promise((resolve) => this.onReady(resolve));
	}

	onMenuOpen() {
		this.events.emit(this.events.MENU_OPEN_EVENT);
	}

	initJWPlayer(player, bidParams, slotTargeting) {
		videoAds.init(player, {featured: true}, slotTargeting);
	}

}

Ads.instance = null;

export default Ads;
