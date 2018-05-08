/* eslint no-console: 0 */

import {Promise} from 'rsvp';
import adsSetup from './setup';

const SLOT_NAME_MAP = {
	MOBILE_TOP_LEADERBOARD: 'top-leaderboard',
	MOBILE_IN_CONTENT: 'incontent-boxad',
	MOBILE_PREFOOTER: 'bottom-boxad',
	BOTTOM_LEADERBOARD: 'bottom-leaderboard'
};

class Ads {
	constructor() {
		this.engine = null;
		this.events = null;
		this.adsContext = null;
		this.currentAdsContext = null;
		this.isLoaded = false;
		this.slotsQueue = [];
		this.onReadyCallbacks = [];
	}

	static getInstance() {
		if (Ads.instance === null) {
			Ads.instance = new Ads();
		}
		return Ads.instance;
	}

	static loadGoogleTag() {
		const script = document.createElement('script');

		script.async = true;
		script.src = '//www.googletagservices.com/tag/js/gpt.js';

		document.head.appendChild(script);
	}

	init(mediaWikiAdsContext = {}) {
		const {events} = window.Wikia.adEngine;

		this.getInstantGlobals()
			.then((instantGlobals) => {
				adsSetup.configure(mediaWikiAdsContext, instantGlobals);
				this.events = events;
				this.engine = adsSetup.init();

				this.isLoaded = true;
				this.onReadyCallbacks.forEach((callback) => callback());
				this.onReadyCallbacks = [];

				Ads.loadGoogleTag();
			});
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
		const context = Wikia.adEngine.context;

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
		const slotId = SLOT_NAME_MAP[name] ? `gpt-${SLOT_NAME_MAP[name]}` : name;
		const context = Wikia.adEngine.context;

		context.push('state.adStack', {id: slotId});
	}

	turnOffAdsForLoggedInUsers() {
		// FIXME
	}

	reload(adsContext, onContextLoadCallback = null) {
		console.error('FIXME reload context called');
	}

	reloadAfterTransition(adsContext) {
		this.reload(adsContext, () => {
			this.events.afterPageWithAdsRender();
		});
	}

	removeSlot(name) {
		if (this.googleTagModule) {
			this.googleTagModule.destroySlots([name]);
		}
	}

	onTransition() {
		this.events.pageChange();

		this.slotsQueue = [];
	}

	waitForReady() {
		return new Promise((resolve) => this.onReady(resolve));
	}

	onMenuOpen() {
		if (!this.uapUnsticked) {
			this.uapUnsticked = true;
			this.events.menuOpen();
		}
	}
}

Ads.instance = null;

export default Ads;
