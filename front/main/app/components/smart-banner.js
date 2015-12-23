import Ember from 'ember';
import {track as mercuryTrack, trackActions} from '../../mercury/utils/track';
import {getSystem} from '../../mercury/utils/browser';

export default Ember.Component.extend({
	classNames: ['smart-banner'],
	classNameBindings: ['noIcon'],

	options: {
		// Language code for App Store
		appStoreLanguage: 'us',

		// Duration to hide the banner after close button is clicked (0 = always show banner)
		daysHiddenAfterClose: 15,

		// Duration to hide the banner after it is clicked (0 = always show banner)
		daysHiddenAfterView: 30,
	},
	day: 86400000,

	appId: Ember.computed('config', 'system', function () {
		return this.get(`config.appId.${this.get('system')}`);
	}),

	appScheme: Ember.computed('config', 'system', function () {
		return this.get(`config.appScheme.${this.get('system')}`);
	}),

	config: Ember.computed(() => {
		return Ember.getWithDefault(Mercury, 'wiki.smartBanner', {});
	}),

	dbName: Ember.computed(() => {
		return Ember.get(Mercury, 'wiki.dbName');
	}),

	description: Ember.computed.oneWay('config.description'),

	icon: Ember.computed.oneWay('config.icon'),

	iconStyle: Ember.computed('icon', function () {
		return new Ember.Handlebars.SafeString(`background-image: url(${this.get('icon')})`);
	}),

	labelInStore: Ember.computed('system', function () {
		return i18n.t(`app.smartbanner-store-${this.get('system')}`);
	}),

	labelInstall: Ember.computed('system', function () {
		return i18n.t(`app.smartbanner-install-${this.get('system')}`);
	}),

	link: Ember.computed('appId', 'dbName', 'system', function () {
		const appId = this.get('appId');

		let link;

		if (this.get('system') === 'android') {
			link = `https://play.google.com/store/apps/details?id=${appId}` +
				`&referrer=utm_source%3Dwikia%26utm_medium%3Dsmartbanner%26utm_term%3D${this.get('dbName')}`;
		} else {
			link = `https://itunes.apple.com/${this.get('options.appStoreLanguage')}/app/id${appId}`;
		}

		return link;
	}),

	noIcon: Ember.computed.not('icon'),

	system: Ember.computed(() => {
		return getSystem();
	}),

	title: Ember.computed.oneWay('config.name'),

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

		if (!$target.is('.sb-close')) {
			this.send('view');
		}
	},

	/**
	 * @returns {void}
	 */
	willInsertElement() {
		// this HAVE TO be run while rendering, but it cannot be run on didInsert/willInsert
		// running this just after render is working too
		Ember.run.scheduleOnce('afterRender', this, this.checkForHiding);
	},

	/**
	 * @returns {void}
	 */
	checkForHiding() {
		// Check if it's already a standalone web app or running within a webui view of an app (not mobile safari)
		const standalone = Ember.get(navigator, 'standalone'),
			config = this.get('config');

		// Don't show banner if device isn't iOS or Android, website is loaded in app or user dismissed banner
		if (this.get('system') && !standalone &&
			config.name && !config.disabled &&
			Ember.$.cookie('sb-closed') !== '1'
		) {
			this.sendAction('toggleVisibility', true);
			this.track(trackActions.impression);
		} else {
			this.set('isVisible', false);
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

		Ember.run.later(this, this.fallbackToStore, 300);
	},

	/**
	 * Open app store
	 *
	 * @returns {void}
	 */
	fallbackToStore() {
		this.track(trackActions.install);
		window.open(this.get('link'), '_blank');
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
		mercuryTrack({
			action,
			category: 'smart-banner',
			label: Ember.get(Mercury, 'wiki.dbName')
		});
	},
});
