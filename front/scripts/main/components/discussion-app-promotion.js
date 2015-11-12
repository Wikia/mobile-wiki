
import {prop} from '../../baseline/mercury/utils/state';

const DiscussionAppPromotionComponent = Ember.Component.extend({
	classNames: ['discussion-app-promotion'],

	discussionsSplashPageConfig: prop('discussionsSplashPageConfig'),

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

export default DiscussionAppPromotionComponent;
