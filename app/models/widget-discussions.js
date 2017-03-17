import Ember from 'ember';
import request from 'ember-ajax/request';

import {extractDomainFromUrl} from '../utils/domain';
import {track} from '../utils/track';
import config from '../config/environment';
import {buildUrl} from '../utils/url';

const {Object: EmberObject, get, getWithDefault, inject} = Ember;

/**
 * @param {string} [path='']
 * @returns {string}
 */
function getDiscussionServiceUrl(path = '') {
	return `https://${config.services.domain}/${config.services.discussions.baseAPIPath}${path}`;
}

export default EmberObject.extend(
	{
		wikiVariables: inject.service(),
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

			return request(getDiscussionServiceUrl(`/${wikiId}/threads`), {
				data: requestData,
				traditional: true,
			}).then(this.normalizeData.bind(this));
		},

		normalizeData(data) {
			return getWithDefault(data, '_embedded.threads', []).map(this.normalizePostData);
		},

		normalizePostData(threadData) {
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
						profileUrl: buildUrl({
							namespace: 'User',
							title: createdBy.name
						})
					},
					creationTimestamp: typeof creationDate === 'string' ?
					(new Date(creationDate)).getTime() / 1000 :
						creationDate.epochSecond,
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
		},

		/**
		 * @param {*} post
		 * @returns {void}
		 */
		upvote(post) {
			const hasUpvoted = post.get('userData.hasUpvoted'),
				method = hasUpvoted ? 'delete' : 'post';

			// Update frontend immediately. If error occurs then we revert state
			post.set('userData.hasUpvoted', !hasUpvoted);

			request(getDiscussionServiceUrl(`/${this.get('wikiVariables.id')}/votes/post/${post.get('id')}`), {
				method,
			}).then((data) => {
				post.set('upvoteCount', data.upvoteCount);
			}).catch(() => {
				post.set('userData.hasUpvoted', hasUpvoted);
			});

			track({
				category: 'MobileWebDiscussions',
				action: hasUpvoted ? 'UndoUpvotePost' : 'UpvotePost',
				label: window.location.origin
			});
		}
	}
);
