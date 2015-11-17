import App from '../app';
import DiscussionErrorMixin from '../mixins/discussion-error';

App.DiscussionForumModel = Ember.Object.extend(
	DiscussionErrorMixin,
	{
		wikiId: null,
		forumId: null,
		name: null,
		pageNum: null,
		posts: null,
		totalPosts: 0,

		connectionError: null,
		notFoundError: null,
		contributors: [],

		/**
		 * @param {number} [pageNum=0]
		 * @returns {Ember.RSVP.Promise}
		 */
		loadPage(pageNum = 0) {
			this.set('pageNum', pageNum);

			return new Ember.RSVP.Promise((resolve) => {
				Ember.$.ajax({
					url: M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}`),
					data: {
						page: this.get('pageNum')
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
						this.setErrorProperty(err, this);
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
		}
	}
);

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
				requestData = {};

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
					forumInstance.setErrorProperty(err, forumInstance);
					resolve(forumInstance);
				}
			});
		});
	}
});

export default App.DiscussionForumModel;
