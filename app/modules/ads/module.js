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

	init(mediaWikiAdsContext = {}) {
		const {events} = window.Wikia.adEngine;

		if (!mediaWikiAdsContext.user || !mediaWikiAdsContext.user.isAuthenticated) {
			this.getInstantGlobals()
				.then((instantGlobals) => {
					adsSetup.configure(mediaWikiAdsContext, instantGlobals);
					this.instantGlobals = instantGlobals;
					this.events = events;
					this.engine = adsSetup.init();

					this.isLoaded = true;
					this.onReadyCallbacks.forEach((callback) => callback());
					this.onReadyCallbacks = [];

					Ads.loadGoogleTag();
				});
		}
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
		const {context} = Wikia.adEngine;

		const name = SLOT_NAME_MAP[slotName] || slotName;
		const slotDefinition = context.get(`slots.${name}`);

		return {
			disableManualInsert: slotDefinition.disableManualInsert,
			isAboveTheFold: slotDefinition.aboveTheFold,
			name: `gpt-${name}`,
			hiddenClassName: 'hide'
		};
	}

	pushSlotToQueue(name) {
		const {context} = Wikia.adEngine;
		const slotId = SLOT_NAME_MAP[name] ? `gpt-${SLOT_NAME_MAP[name]}` : name;

		context.push('state.adStack', {id: slotId});
	}

	afterTransition(mediaWikiAdsContext) {
		const gptProvider = this.engine.getProvider('gpt');

		adsSetup.setupAdContext(mediaWikiAdsContext, this.instantGlobals);

		if (gptProvider) {
			gptProvider.updateCorrelator();
		}

		adBlockDetection.track();
		this.events.afterPageWithAdsRender();
	}

	removeSlot(name) {
		const gptProvider = this.engine.getProvider('gpt');

		if (gptProvider) {
			gptProvider.destroySlots([name]);
		}
	}

	onTransition() {
		this.events.pageChange();
	}

	waitForReady() {
		return new Promise((resolve) => this.onReady(resolve));
	}

	onMenuOpen() {
		this.events.menuOpen();
	}

	initJWPlayer(player, bidParams, slotTargeting) {
		videoAds.init(player, {featured: true}, slotTargeting);
	}

}

Ads.instance = null;

export default Ads;
