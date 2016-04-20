import Ember from 'ember';
import {track, trackActions } from '../utils/discussion-tracker';

export default Ember.Component.extend({
	classNames: ['wikia-stats'],

	items: Ember.computed('model', function () {
		return [
			{
				label: 'app.pages-label',
				namespace: 'main',
				value: this.get('model.articles'),
			},
			{
				label: 'app.photos-label',
				namespace: 'main',
				value: this.get('model.images'),
			},
			{
				label: 'app.videos-label',
				namespace: 'main',
				value: this.get('model.videos'),
			},
			{
				label: 'main.discussions-header-title',
				namespace: 'discussion',
				routeName: 'discussion.index',
				value: this.get('model.discussions'),
			}
		];
	}),
	actions: {
		discussionsClicked() {
			track(trackActions.articleToDiscussions);
		}
	}
});
