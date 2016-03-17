import Ember from 'ember';
import DiscussionContributors from 'contributors';
import DiscussionPosts from 'posts';

const DiscussionForum = Ember.object.extend({
	contributors: null,
	count: null,
	forumId: null,
	pageNum: null,
	pivotId: null,
	posts: null,

	getNormalizedData(data) {
		return {
			count: data.threadCount,
			forumId: data.forumId,
			contributors: DiscussionContributors.create(data._embedded.contributors),
			pivotId: (posts.length > 0 ? posts[0].id : null),
			posts: DiscussionPosts.getNormalizedData(data._embedded['doc:threads'])
		}
	}
});

DiscussionForum.reopenClass({
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

export default DiscussionForum;
