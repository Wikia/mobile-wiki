import DiscussionDeleteControllerMixin from '../../mixins/discussion-delete-controller';

export default Ember.Controller.extend(DiscussionDeleteControllerMixin, {

	application: Ember.inject.controller(),

	smartBannerVisible: Ember.computed.oneWay('application.smartBannerVisible'),
	siteHeadPinned: Ember.computed.oneWay('application.siteHeadPinned'),

	actions: {
		/**
		 * @returns {void}
		 */
		showSortComponent() {
			this.set('sortVisible', true);
		},

		/**
		 * @returns {void}
		 */
		hideSortComponent() {
			this.set('sortVisible', false);
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		retry() {
			this.get('target').send('retry');
		},

		// TODO
		create(postData) {
			this.get('target').send('create', postData);
		},

		goToPost(postId, openInNewTab = false) {
			this.get('target').send('goToPost', postId, openInNewTab);
		},

		loadPage(pageNum) {
			this.get('target').send('loadPage', pageNum);
		},

		upvote(post) {
			this.get('target').send('upvote', post);
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.get('target').send('goToAllDiscussions');
		},
	}
});
