import App from '../app';
import {globalProp} from '../../baseline/mercury/utils/state';

App.DiscussionAppPromotionComponent = Ember.Component.extend({
	classNames: ['discussion-app-promotion'],

	discussionsSplashPageConfig: globalProp('discussionsSplashPageConfig'),

	androidAppLink: Ember.computed('discussionsSplashPageConfig', function () {
		const discussionsSplashPageConfig = this.get('discussionsSplashPageConfig');

		return discussionsSplashPageConfig ? discussionsSplashPageConfig.androidAppLink : null;
	}),

	iosAppLink: Ember.computed('discussionsSplashPageConfig', function () {
		const discussionsSplashPageConfig = this.get('discussionsSplashPageConfig');

		return discussionsSplashPageConfig ? discussionsSplashPageConfig.iosAppLink : null;
	}),

	shouldDisplay: Ember.computed.and('androidAppLink', 'iosAppLink'),
});

export default App.DiscussionAppPromotionComponent;
