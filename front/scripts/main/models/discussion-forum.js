import App from '../app';
import DiscussionBaseModel from './discussion-base';
import DiscussionDeleteModelMixin from '../mixins/discussion-delete-model';

export default App.DiscussionForumModel = DiscussionBaseModel.extend(DiscussionDeleteModelMixin, {
	name: null,
	pageNum: null,
	posts: null,
	totalPosts: 0,

	contributors: [],

	/**
	 * @param {number} pageNum
	 * @param {string} sortBy
	 * @returns {Ember.RSVP.Promise}
	 */
	loadPage(pageNum = 0, sortBy = 'latest') {
		this.set('pageNum', pageNum);

		return new Ember.RSVP.Promise((resolve) => {
			Ember.$.ajax({
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}`),
				data: {
					page: this.get('pageNum'),
					sortKey: this.getSortKey(sortBy),
					viewableOnly: false
				},
				xhrFields: {
					withCredentials: true,
				},
				dataType: 'json',
				success: (data) => {
					const newPosts = data._embedded['doc:threads'],
						allPosts = this.posts.concat(newPosts);

					this.set('posts', allPosts);
					resolve(this);
				},
				error: (err) => {
					this.handleLoadMoreError(err);
					resolve(this);
				}
			});
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
		return new Ember.RSVP.Promise((resolve) => {
			Ember.$.ajax({
				method: 'POST',
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}/threads`),
				data: JSON.stringify(postData),
				contentType: 'application/json',
				xhrFields: {
					withCredentials: true,
				},
				success: (post) => {
					post._embedded.firstPost[0].isNew = true;
					this.posts.insertAt(0, post);
					this.incrementProperty('totalPosts');
					resolve(this);
				},
				error: (err) => {
					if (err.status === 401) {
						this.setFailedState('editor.post-error-not-authorized');
					} else {
						this.setFailedState('editor.post-error-general-error');
					}
					resolve(this);
				}
			});
		});

	}
});

App.DiscussionForumModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} forumId
	 * @param {string} sortBy
	 * @returns { Ember.RSVP.Promise}
	 */
	find(wikiId, forumId, sortBy) {
		return new Ember.RSVP.Promise((resolve) => {
			const forumInstance = App.DiscussionForumModel.create({
					wikiId,
					forumId
				}),
				requestData = {
					viewableOnly: false
				};

			if (sortBy) {
				requestData.sortKey = forumInstance.getSortKey(sortBy);
			}

			Ember.$.ajax({
				url: M.getDiscussionServiceUrl(`/${wikiId}/forums/${forumId}`),
				data: requestData,
				dataType: 'json',
				xhrFields: {
					withCredentials: true,
				},
				success: (data) => {
					const contributors = [],
						posts = data._embedded['doc:threads'],
						totalPosts = data.threadCount;

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
						posts,
						totalPosts
					});
					resolve(forumInstance);
				},
				error: (err) => {
					forumInstance.setErrorProperty(err);
					resolve(forumInstance);
				}
			});
		});
	}
});
