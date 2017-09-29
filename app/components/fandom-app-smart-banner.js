import Ember from 'ember';
import {track, trackActions} from '../utils/track';
import {standalone, system} from '../utils/browser';

const {
	$,
	Component,
	computed,
	inject,
	run,
} = Ember;

export default Component.extend({
	classNames: ['fandom-app-smart-banner'],

	options: {
		// Duration to hide the banner after close button is clicked (0 = always show banner)
		daysHiddenAfterClose: 15,

		// Duration to hide the banner after it is clicked (0 = always show banner)
		daysHiddenAfterView: 30,
	},
	dayInSeconds: 86400000,

	i18n: inject.service(),

	link: () => {
		return system === 'ios' ? 'https://itunes.apple.com/us/app/fandom-powered-by-wikia/id1230063803?ls=1&mt=8'
			: 'https://play.google.com/store/apps/details?id=com.fandom.app&referrer=utm_source%3Dwikia%26utm_medium%3Dsmartbanner';
	},

	storeName: computed(function () {
		return system === 'ios'
			? this.get('i18n').t('fandom-app-banner.app-store')
			: this.get('i18n').t('fandom-app-banner.google-play');
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			this.setSmartBannerCookie(this.get('options.daysHiddenAfterClose'));
			this.sendAction('toggleVisibility', false);
			this.track(trackActions.close);
		},

		onClick() {
			this.setSmartBannerCookie(this.get('options.daysHiddenAfterView'));
			this.sendAction('toggleVisibility', false);
		}
	},

	click() {
		this.track(trackActions.install);
		this.sendAction('toggleVisibility', false);
	},

	/**
	 * @returns {void}
	 */
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
			this.sendAction('toggleVisibility', true);
			this.track(trackActions.impression);
		}
	},

	/**
	 * Sets fandom-sb-closed1 cookie for given number of days
	 *
	 * @param {number} days
	 * @returns {void}
	 */
	setSmartBannerCookie(days) {
		const date = new Date();

		date.setTime(date.getTime() + (days * this.get('dayInSeconds')));
		$.cookie('fandom-sb-closed', 1, {
			expires: date,
			path: '/'
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
