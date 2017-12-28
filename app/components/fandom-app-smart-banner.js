import {inject as service} from '@ember/service';
import $ from 'jquery';
import Component from '@ember/component';
import {computed} from '@ember/object';
import {run} from '@ember/runloop';
import {track, trackActions} from '../utils/track';
import {standalone, system} from '../utils/browser';
import config from '../config/environment';

export default Component.extend({
	i18n: service(),
	smartBanner: service(),

	classNames: ['fandom-app-smart-banner'],
	dayInMiliseconds: 86400000,

	closeButtonSelector: '.fandom-app-smart-banner__close',

	link: computed(() => {
		return system === 'ios'
			? 'https://itunes.apple.com/us/app/fandom-powered-by-wikia/id1230063803?ls=1&mt=8'
			: 'https://play.google.com/store/apps/details'
			+ '?id=com.fandom.app&referrer=utm_source%3Dwikia%26utm_medium%3Dsmartbanner';
	}),

	storeName: computed(function () {
		return system === 'ios'
			? this.get('i18n').t('fandom-app-banner.app-store')
			: this.get('i18n').t('fandom-app-banner.google-play');
	}),

	init() {
		this._super(...arguments);

		this.options = {
			// Duration to hide the banner after close button is clicked (0 = always show banner)
			daysHiddenAfterClose: 30,
			// Duration to hide the banner after it is clicked (0 = always show banner)
			daysHiddenAfterView: 90,
		};
	},

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			this.setSmartBannerCookie(this.get('options.daysHiddenAfterClose'));
			this.get('smartBanner').setVisibility(false);
			this.track(trackActions.close);
		}
	},

	click(event) {
		if (event.target === this.$(this.get('closeButtonSelector'))[0]) {
			return;
		}

		this.track(trackActions.install);
		this.get('smartBanner').setVisibility(false);
		this.setSmartBannerCookie(this.get('options.daysHiddenAfterView'));
	},

	/**
	 * @returns {void}
	 */
	// TODO willInsertElement is not recognized as a lifecycle hook by linter
	willInsertElement() {
		// this HAVE TO be run while rendering, but it cannot be run on didInsert/willInsert
		// running this just after render is working too
		run.scheduleOnce('afterRender', this, this.checkForHiding);
	},

	/**
	 * @returns {void}
	 */
	checkForHiding() {
		if (!standalone && $.cookie('fandom-sb-closed') !== '1') {
			this.get('smartBanner').setVisibility(true);
			this.track(trackActions.impression);
		}
	},

	/**
	 * Sets fandom-sb-closed=1 cookie for given number of days
	 *
	 * @param {number} days
	 * @returns {void}
	 */
	setSmartBannerCookie(days) {
		const date = new Date();

		date.setTime(date.getTime() + (days * this.get('dayInMiliseconds')));
		$.cookie('fandom-sb-closed', 1, {
			expires: date,
			path: '/',
			domain: config.cookieDomain
		});
	},

	/**
	 * @param {string} action
	 * @returns {void}
	 */
	track(action) {
		track({
			action,
			category: 'fandom-app-smart-banner',
			label: this.get('dbName')
		});
	},
});
