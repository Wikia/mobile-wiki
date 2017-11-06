define('mobile-wiki/models/widget-discussions', ['exports', 'mobile-wiki/utils/domain', 'mobile-wiki/utils/track', 'mobile-wiki/config/environment', 'mobile-wiki/utils/url', 'fetch'], function (exports, _domain, _track, _environment, _url, _fetch) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var EmberObject = Ember.Object;
	var getWithDefault = Ember.getWithDefault;
	var get = Ember.get;


	/**
  * @param {string} [path='']
  * @returns {string}
  */
	function getDiscussionServiceUrl() {
		var path = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : '';

		return 'https://' + _environment.default.services.domain + '/' + _environment.default.services.discussions.baseAPIPath + path;
	}

	exports.default = EmberObject.extend({
		wikiVariables: service(),
		/**
   * @param {array|string} [categories=[]]
   * @param {string} [sortBy='trending']
   * @param {integer} [limit=20]
   * @returns {Ember.RSVP.Promise}
   */
		find: function find() {
			var categories = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : [];
			var sortBy = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'trending';
			var limit = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 20;

			var queryString = (0, _url.getQueryString)({
				forumId: categories instanceof Array ? categories : [categories],
				limit: limit,
				sortKey: sortBy === 'trending' ? 'trending' : 'creation_date'
			});

			return (0, _fetch.default)(getDiscussionServiceUrl('/' + this.get('wikiVariables.id') + '/threads' + queryString)).then(function (response) {
				return response.json();
			}).then(this.normalizeData.bind(this));
		},
		normalizeData: function normalizeData(data) {
			return getWithDefault(data, '_embedded.threads', []).map(this.normalizePostData);
		},
		normalizePostData: function normalizePostData(threadData) {
			var creationDate = threadData.creationDate,
			    createdBy = threadData.createdBy,
			    post = EmberObject.create({
				categoryName: threadData.forumName,
				contentImages: null,
				createdBy: {
					avatarUrl: createdBy.avatarUrl,
					badgePermission: createdBy.badgePermission,
					id: createdBy.id,
					name: createdBy.name,
					profileUrl: (0, _url.buildUrl)({
						namespace: 'User',
						title: createdBy.name
					})
				},
				creationTimestamp: typeof creationDate === 'string' ? new Date(creationDate).getTime() / 1000 : creationDate.epochSecond,
				id: threadData.firstPostId,
				openGraph: null,
				rawContent: threadData.rawContent,
				repliesCount: parseInt(threadData.postCount, 10),
				title: threadData.title,
				threadId: threadData.id,
				upvoteCount: parseInt(threadData.upvoteCount, 10),
				userData: null
			}),
			    userData = get(threadData, '_embedded.userData.0'),
			    openGraphData = get(threadData, '_embedded.openGraph.0');

			if (userData) {
				post.set('userData', EmberObject.create({
					hasUpvoted: userData.hasUpvoted
				}));
			}

			if (openGraphData) {
				post.set('openGraph', EmberObject.create({
					description: openGraphData.description,
					domain: (0, _domain.default)(openGraphData.url),
					imageHeight: openGraphData.imageHeight,
					imageUrl: openGraphData.imageUrl,
					imageWidth: openGraphData.imageWidth,
					siteName: openGraphData.siteName,
					title: openGraphData.title,
					type: openGraphData.type,
					url: openGraphData.url
				}));
			}

			return post;
		},


		/**
   * @param {*} post
   * @returns {void}
   */
		upvote: function upvote(post) {
			var hasUpvoted = post.get('userData.hasUpvoted'),
			    method = hasUpvoted ? 'delete' : 'post';

			// Update frontend immediately. If error occurs then we revert state
			post.set('userData.hasUpvoted', !hasUpvoted);

			(0, _fetch.default)(getDiscussionServiceUrl('/' + this.get('wikiVariables.id') + '/votes/post/' + post.get('id')), {
				method: method
			}).then(function (response) {
				if (response.ok) {
					response.json().then(function (data) {
						post.set('upvoteCount', data.upvoteCount);
					});
				} else {
					post.set('userData.hasUpvoted', hasUpvoted);
				}
			});

			(0, _track.track)({
				category: 'MobileWebDiscussions',
				action: hasUpvoted ? 'UndoUpvotePost' : 'UpvotePost',
				label: window.location.origin
			});
		}
	});
});