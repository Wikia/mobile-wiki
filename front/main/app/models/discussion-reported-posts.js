import DiscussionBaseModel from './discussion-base';
import DiscussionModerationModelMixin from '../mixins/discussion-moderation-model';
import ajaxCall from '../utils/ajax-call';

const DiscussionForumModel = DiscussionBaseModel.extend(DiscussionModerationModelMixin, {
	contributors: [],
	isRequesterBlocked: false,

	name: null,
	pageNum: null,
	posts: null,
	totalPosts: 0,

	/**
	 * @param {number} pageNum
	 * @param {object} options
	 * @returns {Ember.RSVP.Promise}
	 */
	loadPage(pageNum = 0, options = {}) {
		const sortBy = options.sortBy || 'trending',
			reported = Boolean(options.reported);

		this.set('pageNum', pageNum);

		return ajaxCall({
			data: {
				page: this.get('pageNum'),
				pivot: this.get('pivotId'),
				sortKey: this.getSortKey(sortBy),
				viewableOnly: false,
				reported
			},
			url: M.getDiscussionServiceUrl(`/${this.wikiId}/posts`),
			success: (data) => {
				const newPosts = data._embedded['doc:posts'],
					allPosts = this.posts.concat(newPosts);

				this.set('posts', allPosts);
			},
			error: (err) => {
				this.handleLoadMoreError(err);
			}
		});
	},

	/**
	 * @param {string} sortBy
	 * @returns {string}
	 */
	getSortKey(sortBy) {
		switch (sortBy) {
		case 'latest':
			return 'creation_date';
		case 'trending':
			return 'trending';
		default:
			return '';
		}
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
			error: (err) => {
				if (err.status === 401) {
					this.setFailedState('editor.post-error-not-authorized');
				} else {
					this.setFailedState('editor.post-error-general-error');
				}
			}
		});
	}
});

DiscussionForumModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} forumId
	 * @param {string} sortBy
	 * @returns { Ember.RSVP.Promise}
	 */
	find(wikiId, forumId, sortBy) {
		const forumInstance = DiscussionForumModel.create({
				wikiId,
				forumId
			}),
			requestData = {
				viewableOnly: false,
				reported: true
			};

		if (sortBy) {
			requestData.sortKey = forumInstance.getSortKey(sortBy);
		}

		return ajaxCall({
			context: forumInstance,
			data: requestData,
			url: M.getDiscussionServiceUrl(`/${wikiId}/posts`),
			success: (data) => {
				const contributors = [],
					posts = data._embedded ? data._embedded['doc:posts'] : [],
					pivotId = (posts.length > 0 ? posts[0].id : null),
					totalPosts = data.postCount;

				posts.forEach((post) => {
					if (post.hasOwnProperty('createdBy')) {
						post.createdBy.profileUrl = M.buildUrl({
							namespace: 'User',
							title: post.createdBy.name
						});
						contributors.push(post.createdBy);
					}
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
