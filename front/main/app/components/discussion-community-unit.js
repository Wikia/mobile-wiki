import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	classNames: ['discussion-community-unit'],
	discussionsSplashPageConfig: M.prop('discussionsSplashPageConfig'),
	currentUser: Ember.inject.service(),

	displayWikiaHomeLink: false,
	displayGuidelinesLink: false,

	androidAppLink: Ember.computed('discussionsSplashPageConfig', function () {
		const discussionsSplashPageConfig = this.get('discussionsSplashPageConfig');

		return discussionsSplashPageConfig ? discussionsSplashPageConfig.androidAppLink : null;
	}),

	iosAppLink: Ember.computed('discussionsSplashPageConfig', function () {
		const discussionsSplashPageConfig = this.get('discussionsSplashPageConfig');

		return discussionsSplashPageConfig ? discussionsSplashPageConfig.iosAppLink : null;
	}),

	displayAppPromotion: Ember.computed.or('androidAppLink', 'iosAppLink'),
	wikiName: Ember.computed(function () {
		if (this.get('displayWikiaHomeLink') || this.get('displayGuidelinesLink')) {
			return Ember.get(Mercury, 'wiki.siteName');
		}
	}),

	/**
	 * TREK INITIATIVE EXPERIMENT
	 *
	 * @returns {boolean}
	 */
	displayMemoryAlphaLink: Ember.computed(() => {
		return Boolean(Ember.get(Mercury, 'wiki.id') === 734209);
	}),

	/**
	 * TREK INITIATIVE EXPERIMENT
	 *
	 * @returns {string}
	 */
	wikiHomeLinkText: Ember.computed('displayMemoryAlphaLink', function () {
		if (this.get('displayMemoryAlphaLink') === true) {
			return 'The Trek Initiative';
		} else {
			return i18n.t('main.wiki-home', {ns: 'discussion'});
		}
	}),

	actions: {

		/**
		 * Tracks guidelines link
		 * @returns {void}
		 */
		openGuidelines() {
			track(trackActions.GuidelinesLinkTapped);
		},
	}
});
