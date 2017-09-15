import Ember from 'ember';
import {track, trackActions} from '../utils/track';
import {standalone} from '../utils/browser';

const {
	$,
	Component,
	computed,
	get,
	inject,
	String: {htmlSafe},
	run,
} = Ember;

/**
 * This is a fork from smart-banner-android
 * Needed for a/b test purposes
 * Uses code repetition and will be removed after the test is done
 */
export default Component.extend({
	classNames: ['smart-banner-test'],

	currentUser: inject.service(),
	wikiVariables: inject.service(),

	appScheme: computed.oneWay(`config.appScheme.ios`),
	config: computed('wikiVariables', function () {
		return this.get('wikiVariables').get('smartBanner') || {};
	}),

	options: {
		// Language code for App Store
		appStoreLanguage: 'us',

		// Duration to hide the banner after close button is clicked (0 = always show banner)
		daysHiddenAfterClose: 15,

		// Duration to hide the banner after it is clicked (0 = always show banner)
		daysHiddenAfterView: 30,
	},
	day: 86400000,

	link: 'https://itunes.apple.com/us/developer/wikia-inc/id422467077',

	actions: {
		/**
		 * @returns {void}
		 */
		close() {
			this.setSmartBannerCookie(this.get('options.daysHiddenAfterClose'));
			this.sendAction('toggleVisibility', false);
			this.track(trackActions.close);
		},

		/**
		 * @returns {void}
		 */
		view() {
			const appScheme = this.get('appScheme');

			this.setSmartBannerCookie(this.get('options.daysHiddenAfterView'));

			if (appScheme) {
				this.tryToOpenApp(appScheme);
			} else {
				window.open(this.get('link'), '_blank');
			}

			this.sendAction('toggleVisibility', false);
		},
	},

	/**
	 * @param {MouseEvent} event
	 * @returns {void}
	 */
	click(event) {
		const $target = this.$(event.target);

		if (!$target.is('.sb-test-close')) {
			this.send('view');
		}
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
		if (!standalone && $.cookie('sb-closed') !== '1') {
			this.sendAction('toggleVisibility', true);
			this.track(trackActions.impression);
		}
	},

	/**
	 * Try to open app using custom scheme and if it fails go to fallback function
	 *
	 * @param {string} appScheme
	 * @returns {void}
	 */
	tryToOpenApp(appScheme) {
		this.track(trackActions.open);
		window.document.location.href = `${appScheme}://`;

		run.later(this, this.fallbackToStore, 300);
	},

	/**
	 * Open app store
	 *
	 * @returns {void}
	 */
	fallbackToStore() {
		this.track(trackActions.install);
		window.open(this.get('link'));
	},

	/**
	 * Sets sb-closed=1 cookie for given number of days
	 *
	 * @param {number} days
	 * @returns {void}
	 */
	setSmartBannerCookie(days) {
		const date = new Date();

		date.setTime(date.getTime() + (days * this.get('day')));
		$.cookie('sb-closed', 1, {
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
			category: 'smart-banner-ios-test',
			label: this.get('dbName')
		});
	},
});
