import Ember from 'ember';

const DiscussionForumModel = Ember.Object.extend(
	{
		setNormalizedData(data) {
			const posts = Ember.getWithDefault(data, '_embedded.threads', []).map(threadData => {
				const creationDate = threadData.creationDate;
				const createdBy = threadData.createdBy;

				const post = {
					categoryName: threadData.forumName,
					contentImages: null,
					createdBy: {
						avatarUrl: createdBy.avatarUrl,
						badgePermission: createdBy.badgePermission,
						id: createdBy.id,
						name: createdBy.name,
						profileUrl: M.buildUrl({
							namespace: 'User',
							title: createdBy.name
						})
					},
					creationTimestamp: typeof creationDate === 'string' ? (new Date(creationDate)).getTime() / 1000 : creationDate.epochSecond,
					id: threadData.firstPostId,
					openGraph: null,
					rawContent: threadData.rawContent,
					repliesCount: parseInt(threadData.postCount, 10),
					title: threadData.title,
					threadId: threadData.id,
					upvoteCount: parseInt(threadData.upvoteCount, 10),
					userData: null,
				};

				// TODO userdata, opengraph, contentImages

				return post;
			});

			this.set('posts', posts);
		},

		/**
		 * @param {*} post
		 * @returns {void}
		 */
		upvote(post) {
			const entityId = post.get('id'),
				hasUpvoted = post.get('userData.hasUpvoted'),
				method = hasUpvoted ? 'delete' : 'post';

			// the change in the front-end is done here
			post.set('userData.hasUpvoted', !hasUpvoted);

			request(M.getDiscussionServiceUrl(`/${Ember.get(Mercury, 'wiki.id')}/votes/post/${post.get('id')}`), {
				method,
			}).then((data) => {
				post.set('upvoteCount', data.upvoteCount);

				// TODO
				// if (hasUpvoted) {
				// 	track(trackActions.UndoUpvotePost);
				// } else {
				// 	track(trackActions.UpvotePost);
				// }
			}).catch(() => {
				post.set('userData.hasUpvoted', hasUpvoted);
			});
		}
	}
);

DiscussionForumModel.reopenClass(
	{
		/**
		 * @param {number} wikiId
		 * @param {array|string} [categories=[]]
		 * @param {string} [sortBy='trending']
		 * @param {integer} [limit=20]
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, categories = [], sortBy = 'trending', limit = 20) {
			return new Ember.RSVP.Promise((resolve, reject) => {
				const forumInstance = DiscussionForumModel.create({
						wikiId
					}),
					requestData = {
						forumId: categories instanceof Array ? categories : [categories],
						limit,
						sortKey: sortBy === 'trending' ? 'trending' : 'creation_date'
					};

				request(M.getDiscussionServiceUrl(`/${wikiId}/threads`), {
					data: requestData,
					traditional: true,
				}).then((data) => {
					forumInstance.setNormalizedData(data);
					resolve(forumInstance);
				}).catch((err) => {
					reject(forumInstance);
				});
			});
		},
	}
);

export default DiscussionForumModel;
