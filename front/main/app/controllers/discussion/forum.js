import Ember from 'ember';
import DiscussionDeleteControllerMixin from '../../mixins/discussion-delete-controller';

export default Ember.Controller.extend(DiscussionDeleteControllerMixin, {

	application: Ember.inject.controller(),

	smartBannerVisible: Ember.computed.oneWay('application.smartBannerVisible'),
	siteHeadPinned: Ember.computed.oneWay('application.siteHeadPinned'),

	actions: {
		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		retry() {
			this.get('target').send('retry');
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @param {object} postData
		 * @returns {void}
		 */
		create(postData) {
			this.get('target').send('create', postData);
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @param {string} postId
		 * @param {boolean} openInNewTab
		 * @returns {void}
		 */
		goToPost(postId, openInNewTab = false) {
			this.get('target').send('goToPost', postId, openInNewTab);
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @param {number} pageNum
		 * @returns {void}
		 */
		loadPage(pageNum) {
			this.get('target').send('loadPage', pageNum);
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @param {object} post
		 * @returns {void}
		 */
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

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @param {string} sortBy
		 * @returns {void}
		 */
		setSortBy(sortBy) {
			this.get('target').send('setSortBy', sortBy);
		}
	}
});
