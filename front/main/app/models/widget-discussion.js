import Ember from 'ember';
import request from 'ember-ajax/request';

const DiscussionForumModel = Ember.Object.extend(
	{
		/**
		 * @param {number} wikiId
		 * @param {array|string} [categories=[]]
		 * @param {string} [sortBy='trending']
		 * @param {integer} [limit=20]
		 * @returns {Ember.RSVP.Promise}
		 */
		find(wikiId, categories = [], sortBy = 'trending', limit = 20) {
			const requestData = {
					forumId: categories instanceof Array ? categories : [categories],
					limit,
					sortKey: sortBy === 'trending' ? 'trending' : 'creation_date'
				};

			return request(M.getDiscussionServiceUrl(`/${wikiId}/threads`), {
				data: requestData,
				traditional: true,
			}).then(this.normalizeData);
		},

		normalizeData(data) {
			return Ember.getWithDefault(data, '_embedded.threads', []).map(threadData => {
				const creationDate = threadData.creationDate,
					createdBy = threadData.createdBy,
					post = {
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

export default DiscussionForumModel;
