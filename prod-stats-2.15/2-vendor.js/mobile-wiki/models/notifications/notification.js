define('mobile-wiki/models/notifications/notification', ['exports', 'mobile-wiki/models/notifications/contributor', 'fetch', 'mobile-wiki/utils/iso-date-time', 'mobile-wiki/utils/notification-types', 'mobile-wiki/utils/url'], function (exports, _contributor, _fetch, _isoDateTime, _notificationTypes, _url) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var A = Ember.A,
	    EmberObject = Ember.Object,
	    get = Ember.get,
	    avatar = 'https://static.wikia.nocookie.net/messaging/images/1/19/Avatar.jpg/revision/latest/scale-to-width-down/50';


	var NotificationModel = EmberObject.extend({
		title: null,
		snippet: null,
		timestamp: null,
		communityName: null,
		type: null,
		isUnread: false,
		totalUniqueActors: 1,
		latestActors: [],
		uri: null,

		markAsRead: function markAsRead() {
			var _this = this;

			return (0, _fetch.default)((0, _url.getOnSiteNotificationsServiceUrl)('/notifications/mark-as-read/by-uri'), {
				method: 'POST',
				body: JSON.stringify([this.get('uri')]),
				credentials: 'include',
				headers: { 'Content-Type': 'application/json' }
			}).then(function () {
				_this.set('isUnread', false);
			});
		}
	});

	NotificationModel.reopenClass({
		create: function create(ownerInjection, notificationData) {
			return this._super(ownerInjection, {
				title: get(notificationData, 'refersTo.title'),
				snippet: get(notificationData, 'refersTo.snippet'),
				uri: get(notificationData, 'refersTo.uri'),
				latestEventUri: get(notificationData, 'events.latestEvent.uri'),
				timestamp: (0, _isoDateTime.convertToTimestamp)(get(notificationData, 'events.latestEvent.when')),
				communityName: get(notificationData, 'community.name'),
				communityId: get(notificationData, 'community.id'),
				isUnread: notificationData.read === false,
				totalUniqueActors: get(notificationData, 'events.totalUniqueActors'),
				latestActors: NotificationModel.createActors(ownerInjection, get(notificationData, 'events.latestActors')),
				type: NotificationModel.getTypeFromApiData(notificationData)
			});
		},
		createActors: function createActors(ownerInjection, actors) {
			return actors.reduce(function (array, actor) {
				if (!actor.avatarUrl) {
					actor.avatarUrl = avatar;
				}
				array.addObject(_contributor.default.create(ownerInjection, actor));
				return array;
			}, new A());
		},
		getTypeFromApiData: function getTypeFromApiData(apiData) {
			if (apiData.type === 'upvote-notification') {
				if (apiData.refersTo.type === 'discussion-post') {
					return _notificationTypes.default.discussionUpvoteReply;
				} else {
					return _notificationTypes.default.discussionUpvotePost;
				}
			} else if (apiData.type === 'replies-notification') {
				return _notificationTypes.default.discussionReply;
			} else if (apiData.type === 'announcement-notification') {
				return _notificationTypes.default.announcement;
			}
		}
	});

	exports.default = NotificationModel;
});