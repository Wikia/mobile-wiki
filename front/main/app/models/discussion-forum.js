import DiscussionBaseModel from './discussion-base';
import DiscussionModerationModelMixin from '../mixins/discussion-moderation-model';
import DiscussionForumActionsModelMixin from '../mixins/discussion-forum-actions-model';
import ajaxCall from '../utils/ajax-call';
import {track, trackActions} from '../utils/discussion-tracker';

const DiscussionForumModel = DiscussionBaseModel.extend(
	DiscussionModerationModelMixin,
	DiscussionForumActionsModelMixin,
	{

		normalizePostData(post) {
			post.firstPost = post._embedded.firstPost[0];
			post.firstPost.isReported = post.isReported;
			if (Ember.get(post, 'firstPost._embedded.userData')) {
				post._embedded.userData = post.firstPost._embedded.userData;
			}
		},

		/**
		 * @param {number} pageNum
		 * @param {string} [sortBy='trending']
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(pageNum = 0, sortBy = 'trending') {
			this.set('pageNum', pageNum);

			return ajaxCall({
				data: {
					page: this.get('pageNum'),
					pivot: this.get('pivotId'),
					sortKey: this.getSortKey(sortBy),
					viewableOnly: false
				},
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}`),
				success: (data) => {
					const newPosts = data._embedded['doc:threads'];
					let allPosts;

					newPosts.forEach(this.normalizePostData);

					allPosts = this.posts.concat(newPosts);

					this.set('posts', allPosts);
				},
				error: (err) => {
					this.handleLoadMoreError(err);
				}
			});
		},

		/**
		 * Create new post in Discussion Service
		 * @param {object} postData
		 * @returns {Ember.RSVP.Promise}
		 */
		createPost(postData) {
			this.setFailedState(null);
			return ajaxCall({
				data: JSON.stringify(postData),
				method: 'POST',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}/threads`),
				success: (post) => {
					post._embedded.firstPost[0].isNew = true;

					this.normalizePostData(post);

					this.posts.insertAt(0, post);
					this.incrementProperty('totalPosts');

					track(trackActions.PostCreate);
				},
				error: (err) => {
					this.onCreatePostError(err);
				}
			});
		}
	}
);

DiscussionForumModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} forumId
	 * @param {string} [sortBy='trending']
	 * @returns { Ember.RSVP.Promise}
	 */
	find(wikiId, forumId, sortBy = 'trending') {
		const forumInstance = DiscussionForumModel.create({
				wikiId,
				forumId
			}),
			requestData = {
				viewableOnly: false,
			};

		if (sortBy) {
			requestData.sortKey = forumInstance.getSortKey(sortBy);
		}

		return ajaxCall({
			context: forumInstance,
			data: requestData,
			url: M.getDiscussionServiceUrl(`/${wikiId}/forums/${forumId}`),
			success: (data) => {
				const contributors = [],
					embedded = data._embedded,
					posts = embedded && embedded['doc:threads'] ? embedded['doc:threads'] : [],
					pivotId = (posts.length > 0 ? posts[0].id : null),
					totalPosts = data.threadCount;

				posts.forEach((post) => {
					if (post.hasOwnProperty('createdBy')) {
						post.createdBy.profileUrl = M.buildUrl({
							namespace: 'User',
							title: post.createdBy.name
						});

						contributors.push(post.createdBy);
					}

					forumInstance.normalizePostData(post);
				});

				forumInstance.setProperties({
					contributors,
					name: data.name,
					pivotId,
					posts,
					totalPosts
				});
			},
			error: (err) => {
				forumInstance.setErrorProperty(err);
			}
		});
	}
});

export default DiscussionForumModel;
