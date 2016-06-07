import Ember from 'ember';
export default Ember.Component.extend({
	classNames: ['discussion-community-unit'],
	discussionsSplashPageConfig: M.prop('discussionsSplashPageConfig'),

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
});
