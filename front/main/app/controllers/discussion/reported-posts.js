import Ember from 'ember';
import DiscussionModerationControllerMixin from '../../mixins/discussion-moderation-controller';
import DiscussionUpvoteControllerMixin from '../../mixins/discussion-upvote-controller';

export default Ember.Controller.extend(
	DiscussionModerationControllerMixin,
	DiscussionUpvoteControllerMixin,
	{
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
			 * @param {number} pageNum
			 * @returns {void}
			 */
			loadPage(pageNum) {
				this.get('target').send('loadPage', pageNum);
			},

			/**
			 * Bubbles up to DiscussionForumRoute
			 *
			 * @param {string} sortBy
			 * @returns {void}
			 */
			setSortBy(sortBy) {
				this.get('target').send('setSortBy', sortBy);
			},

			applyFilters(sortBy, shouldShowReported) {
				this.get('target').send('applyFilters', sortBy, shouldShowReported);
			}
		}
	}
);
