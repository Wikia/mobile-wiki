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
	dayInSeconds: 86400000,

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
		if (!standalone && $.cookie('sb-closed') !== '1') {
			this.sendAction('toggleVisibility', true);
			this.track(trackActions.impression);
		}
	},

	/**
	 * Sets sb-closed=1 cookie for given number of days
	 *
	 * @param {number} days
	 * @returns {void}
	 */
	setSmartBannerCookie(days) {
		const date = new Date();

		date.setTime(date.getTime() + (days * this.get('dayInSeconds')));
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
