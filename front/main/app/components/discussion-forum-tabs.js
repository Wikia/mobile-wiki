import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Component.extend({
	classNames: ['discussion-forum-tabs', 'clearfix'],
	tagName: 'ul',
	routing: Ember.inject.service('-routing'),

	allTabActive: Ember.computed(function() {
		return this.get('routing.currentRouteName') === 'discussion.forum';
	}),

	followTabActive: Ember.computed(function() {
		return this.get('routing.currentRouteName') === 'discussion.follow';
	}),
	
});
