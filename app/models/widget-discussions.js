import { inject as service } from '@ember/service';
import EmberObject, { getWithDefault, get } from '@ember/object';
import extractDomainFromUrl from '../utils/domain';
import { track } from '../utils/track';
import config from '../config/environment';
import { getQueryString } from '../utils/url';
import fetch from 'fetch';

/**
 * @param {string} [path='']
 * @returns {string}
 */
function getDiscussionServiceUrl(path = '') {
	return `https://${config.services.domain}/${config.services.discussions.baseAPIPath}${path}`;
}

export default EmberObject.extend(
	{
		wikiVariables: service(),
		wikiUrls: service(),

		/**
		 * @param {array|string} [categories=[]]
		 * @param {string} [sortBy='trending']
		 * @param {integer} [limit=20]
		 * @returns {Ember.RSVP.Promise}
		 */
		find(categories = [], sortBy = 'trending', limit = 20) {
			const queryString = getQueryString({
				forumId: categories instanceof Array ? categories : [categories],
				limit,
				sortKey: sortBy === 'trending' ? 'trending' : 'creation_date'
			});

			return fetch(getDiscussionServiceUrl(`/${this.get('wikiVariables.id')}/threads${queryString}`))
				.then(response => response.json())
				.then(this.normalizeData.bind(this));
		},

		normalizeData(data) {
			return getWithDefault(data, '_embedded.threads', []).map(this.normalizePostData);
		},

		normalizePostData(threadData) {
			const creationDate = threadData.creationDate;
			const createdBy = threadData.createdBy;
			const post = EmberObject.create({
				categoryName: threadData.forumName,
				contentImages: null,
				createdBy: {
					avatarUrl: createdBy.avatarUrl,
					badgePermission: createdBy.badgePermission,
					id: createdBy.id,
					name: createdBy.name,
					profileUrl: this.wikiUrls.build({
						host: this.get('wikiVariables.host'),
						namespace: 'User',
						query: {
							useskin: 'oasis'
						},
						title: createdBy.name
					})
				},
				creationTimestamp: typeof creationDate === 'string' ?
					(new Date(creationDate)).getTime() / 1000 : creationDate.epochSecond,
				id: threadData.firstPostId,
				openGraph: null,
				rawContent: threadData.rawContent,
				repliesCount: parseInt(threadData.postCount, 10),
				title: threadData.title,
				threadId: threadData.id,
				upvoteCount: parseInt(threadData.upvoteCount, 10),
				userData: null,
			});
			const userData = get(threadData, '_embedded.userData.0');
			const openGraphData = get(threadData, '_embedded.openGraph.0');

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
			const hasUpvoted = post.get('userData.hasUpvoted');
			const method = hasUpvoted ? 'delete' : 'post';

			// Update frontend immediately. If error occurs then we revert state
			post.set('userData.hasUpvoted', !hasUpvoted);

			fetch(getDiscussionServiceUrl(`/${this.get('wikiVariables.id')}/votes/post/${post.get('id')}`), {
				method,
			}).then((response) => {
				if (response.ok) {
					response.json().then((data) => {
						post.set('upvoteCount', data.upvoteCount);
					});
				} else {
					post.set('userData.hasUpvoted', hasUpvoted);
				}
			});

			track({
				category: 'MobileWebDiscussions',
				action: hasUpvoted ? 'UndoUpvotePost' : 'UpvotePost',
				label: window.location.origin
			});
		}
	}
);
