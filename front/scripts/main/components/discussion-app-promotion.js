import App from '../app';

export default App.DiscussionAppPromotionComponent = Ember.Component.extend({
	classNames: ['discussion-app-promotion'],

	discussionsSplashPageConfig: M.prop('discussionsSplashPageConfig'),

	androidAppLink: Ember.computed('discussionsSplashPageConfig', function () {
		const discussionsSplashPageConfig = this.get('discussionsSplashPageConfig');

		return discussionsSplashPageConfig ? discussionsSplashPageConfig.androidAppLink : null;
	}),

	iosAppLink: Ember.computed('discussionsSplashPageConfig', function () {
		const discussionsSplashPageConfig = this.get('discussionsSplashPageConfig');

		return discussionsSplashPageConfig ? discussionsSplashPageConfig.iosAppLink : null;
	}),

	shouldDisplay: Ember.computed.or('androidAppLink', 'iosAppLink'),
});
