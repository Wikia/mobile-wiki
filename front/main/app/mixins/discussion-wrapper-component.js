import Ember from 'ember';
import {track, trackActions} from '../utils/discussion-tracker';

export default Ember.Mixin.create(
	{
		classNames: ['forum-wrapper', 'discussion', 'forum'],
		isLoading: false,
		page: 1,
		posts: 0,
		totalPosts: 0,

		showToTheTopButton: Ember.computed('firstPageLoaded', function () {
			return !this.get('firstPageLoaded');
		}),

		showLoadMoreButton: Ember.computed.alias('hasMore'),

		hasMore: Ember.computed('totalPosts', 'page', function () {
			return this.get('totalPosts') > this.getWithDefault('page', 1) * 20;
		}),

		loadingPageResolveObserver: Ember.observer('posts', 'posts.length', 'minorError', function () {
			this.set('isLoading', false);
		}),

		loadNextPage() {
			this.set('isLoading', true);
			this.incrementProperty('page');

			this.sendAction('loadPage', this.get('page'));
		},

		actions: {
			loadNextPage() {
				if (!this.get('isLoading')) {
					track(trackActions.PostLoadMore);
					this.loadNextPage();
				}
			},
		},
	}
);
