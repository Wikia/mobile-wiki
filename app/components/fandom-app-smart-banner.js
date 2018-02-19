import {inject as service} from '@ember/service';
import Component from '@ember/component';
import {computed} from '@ember/object';
import {run} from '@ember/runloop';
import {trackActions} from '../utils/track';
import {system} from '../utils/browser';

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
			this.get('smartBanner').setCookie(this.get('options.daysHiddenAfterClose'));
			this.get('smartBanner').setVisibility(false);
			this.get('smartBanner').track(trackActions.close);
		}
	},

	click(event) {
		if (event.target === this.element.querySelector(this.get('closeButtonSelector'))) {
			return;
		}

		this.get('smartBanner').track(trackActions.install);
		this.get('smartBanner').setVisibility(false);
		this.get('smartBanner').setCookie(this.get('options.daysHiddenAfterView'));
	}
});
