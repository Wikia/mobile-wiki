import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	classNames: ['discussion-forum-tabs', 'clearfix'],
	tagName: 'ul',
	routing: Ember.inject.service('-routing'),

	allTabActive: Ember.computed.equal('routing.currentRouteName', 'discussion.forum'),

	followTabActive: Ember.computed.equal('routing.currentRouteName', 'discussion.follow'),

	actions: {
		trackFollowedPostsClick: function () {
			track(trackActions.FollowedPostTapped);
		}
	}

});
