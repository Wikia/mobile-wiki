import DiscussionBaseModel from './base';
import DiscussionModerationModelMixin from '../../mixins/discussion-moderation-model';
import DiscussionContributionModelMixin from '../../mixins/discussion-contribution-model';
import ajaxCall from '../../utils/ajax-call';
import DiscussionContributor from './domain/contributor';
import DiscussionContributors from './domain/contributors';
import DiscussionPost from './domain/post';
import DiscussionReply from './domain/reply';
import {track, trackActions} from '../../utils/discussion-tracker';

const DiscussionPostModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionContributionModelMixin,
	{
		pivotId: null,
		replyLimit: 10,

		/**
		 * @returns {Ember.RSVP.Promise}
		 */
		loadNextPage() {
			return ajaxCall({
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${this.postId}`, {
					limit: this.get('replyLimit'),
					page: this.get('data.page') + 1,
					pivot: this.get('pivotId'),
					responseGroup: 'full',
					sortDirection: 'descending',
					sortKey: 'creation_date',
					viewableOnly: false,
				}),
				success: (data) => {
					this.get('data.replies').unshiftObjects(
						// Note that we have to reverse the list we get back because how we're displaying
						// replies on the page; we want to see the newest replies first but show them
						// starting with oldest of the current list at the top.
						Ember.get(data, '._embedded.doc:posts').reverse()
							.map((reply) => {
								reply.threadCreatedBy = this.get('data.createdBy');
								return DiscussionReply.create(reply);
							})
					);

					this.incrementProperty('data.page');
				},
				error: (err) => {
					this.handleLoadMoreError(err);
				},
			});
		},

		/**
		 * @param {object} apiData
		 *
		 * @returns {void}
		 */
		setNormalizedData(apiData) {
			const normalizedData = DiscussionPost.createFromThreadData(apiData),
				apiRepliesData = Ember.getWithDefault(apiData, '_embedded.doc:posts', []);

			let contributors,
				normalizedRepliesData,
				pivotId;

			normalizedRepliesData = apiRepliesData.map((replyData) => {
				replyData.threadCreatedBy = normalizedData.get('createdBy');
				return DiscussionReply.create(replyData);
			});

			if (normalizedRepliesData.length) {
				pivotId = normalizedRepliesData[0].id;

				// We need oldest replies displayed first
				normalizedRepliesData.reverse();
			}

			// contributors = DiscussionContributors.create(Ember.get(apiData, '_embedded.contributors[0]'));
			// Work in Progress: szpachla until SOC-1586 is done
			contributors = DiscussionContributors.create({
				count: parseInt(apiData.postCount, 10),
				userInfo: normalizedRepliesData.map((reply) => DiscussionContributor.create(reply.createdBy)),
			});

			normalizedData.setProperties({
				canModerate: Ember.getWithDefault(normalizedRepliesData, '0.userData.permissions.canModerate', false),
				contributors,
				forumId: apiData.forumId,
				page: 0,
				replies: normalizedRepliesData,
				repliesCount: parseInt(apiData.postCount, 10),
			});

			this.setProperties({
				data: normalizedData,
				pivotId
			});
		}
	}
);

DiscussionPostModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} postId
	 *
	 * @returns {Ember.RSVP.Promise}
	 */
	find(wikiId, postId) {
		const postInstance = DiscussionPostModel.create({
			wikiId,
			postId
		});

		return ajaxCall({
			context: postInstance,
			url: M.getDiscussionServiceUrl(`/${wikiId}/threads/${postId}`, {
				limit: postInstance.replyLimit,
				responseGroup: 'full',
				sortDirection: 'descending',
				sortKey: 'creation_date',
				viewableOnly: false
			}),
			success: (data) => {
				postInstance.setNormalizedData(data);
			},
			error: (err) => {
				postInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionPostModel;
