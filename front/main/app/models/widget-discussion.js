import Ember from 'ember';
import request from 'ember-ajax/request';

import {extractDomainFromUrl} from '../utils/domain';
import {track} from 'common/utils/track';

const {Object: EmberObject, get, getWithDefault} = Ember;

const DiscussionForumModel = EmberObject.extend(
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
			return getWithDefault(data, '_embedded.threads', []).map(threadData => {
				const creationDate = threadData.creationDate,
					createdBy = threadData.createdBy,
					post = EmberObject.create({
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
					}),
					userData = get(threadData, '_embedded.userData.0'),
					openGraphData = get(threadData, '_embedded.openGraph.0');

				if (userData) {
					post.set('userData', EmberObject.create({
						hasUpvoted: userData.hasUpvoted,
					}));
				}

				if (openGraphData) {
					post.set('openGraph', EmberObject.create({
						description: openGraphData.description,
						domain: extractDomainFromUrl(openGraphData.url),
						imageHeight: openGraphData.imageHeight,
						imageUrl: openGraphData.imageUrl,
						imageWidth: openGraphData.imageWidth,
						siteName: openGraphData.siteName,
						title: openGraphData.title,
						type: openGraphData.type,
						url: openGraphData.url,
					}));
				}

				return post;
			});
		},

		/**
		 * @param {*} post
		 * @returns {void}
		 */
		upvote(post) {
			const hasUpvoted = post.get('userData.hasUpvoted'),
				method = hasUpvoted ? 'delete' : 'post';

			// the change in the front-end is done here
			post.set('userData.hasUpvoted', !hasUpvoted);

			request(M.getDiscussionServiceUrl(`/${get(Mercury, 'wiki.id')}/votes/post/${post.get('id')}`), {
				method,
			}).then((data) => {
				post.set('upvoteCount', data.upvoteCount);
			}).catch(() => {
				post.set('userData.hasUpvoted', hasUpvoted);
			});

			if (hasUpvoted) {
				track({
					category: 'MobileWebDiscussions',
					action: 'UndoUpvotePost',
					label: window.location.origin
				});
			} else {
				track({
					category: 'MobileWebDiscussions',
					action: 'UpvotePost',
					label: window.location.origin
				});
			}
		}
	}
);

export default DiscussionForumModel;
