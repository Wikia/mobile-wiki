import Ember from 'ember';
import DiscussionContributor from './contributor';
import fetch from 'fetch';
import {convertToTimestamp} from '../../utils/iso-date-time';
import notificationTypes from '../../utils/notification-types';
import {getOnSiteNotificationsServiceUrl} from '../../utils/url';

const {
		A,
		Object: EmberObject,
		get,
	} = Ember,
	avatar = 'http://static.wikia.nocookie.net/messaging/images/1/19/Avatar.jpg/revision/latest/scale-to-width-down/50';

const NotificationModel = EmberObject.extend({
	title: null,
	snippet: null,
	timestamp: null,
	communityName: null,
	type: null,
	isUnread: false,
	totalUniqueActors: 1,
	latestActors: [],
	uri: null,

	markAsRead() {
		return fetch(getOnSiteNotificationsServiceUrl(`/notifications/mark-as-read/by-uri`), {
			method: 'POST',
			body: JSON.stringify([this.get('uri')]),
			credentials: 'include',
			headers: {'Content-Type': 'application/json'},
		}).then(() => {
			this.set('isUnread', false);
		});
	},
});

NotificationModel.reopenClass({
	/**
	 * @param {*} ownerInjection
	 * @param {EmberObject} notificationData
	 *
	 * @returns {array}
	 */
	create(ownerInjection, notificationData) {
		return this._super(ownerInjection, {
			title: get(notificationData, 'refersTo.title'),
			snippet: get(notificationData, 'refersTo.snippet'),
			uri: get(notificationData, 'refersTo.uri'),
			latestEventUri: get(notificationData, 'events.latestEvent.uri'),
			timestamp: convertToTimestamp(get(notificationData, 'events.latestEvent.when')),
			communityName: get(notificationData, 'community.name'),
			communityId: get(notificationData, 'community.id'),
			isUnread: notificationData.read === false,
			totalUniqueActors: get(notificationData, 'events.totalUniqueActors'),
			latestActors: NotificationModel.createActors(ownerInjection, get(notificationData, 'events.latestActors')),
			type: NotificationModel.getTypeFromApiData(notificationData)
		});
	},

	createActors(ownerInjection, actors) {
		return actors.reduce((array, actor) => {
			if (!actor.avatarUrl) {
				actor.avatarUrl = avatar;
			}
			array.addObject(DiscussionContributor.create(ownerInjection, actor));
			return array;
		}, new A());
	},

	getTypeFromApiData(apiData) {
		if (apiData.type === 'upvote-notification') {
			if (apiData.refersTo.type === 'discussion-post') {
				return notificationTypes.discussionUpvoteReply;
			} else {
				return notificationTypes.discussionUpvotePost;
			}
		} else if (apiData.type === 'replies-notification') {
			return notificationTypes.discussionReply;
		} else if (apiData.type === 'announcement-notification') {
			return notificationTypes.announcement;
		}
	}
});

export default NotificationModel;
