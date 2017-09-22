import Ember from 'ember';
import wrapMeHelper from '../helpers/wrap-me';
import NewReplyNotificationMixin from '../mixins/new-reply-notification';
import PostUpvoteNotificationMixin from '../mixins/post-upvote-notification';
import ReplyUpvoteNotificationMixin from '../mixins/reply-upvote-notification';
import MarkAsReadNotificationMixin from '../mixins/mark-as-read-notification';
import {trackClick, trackImpression} from '../utils/notifications-tracker';
import notificationTypes from '../utils/notification-types';

const {Component, computed, inject} = Ember;

export default Component.extend(
	NewReplyNotificationMixin,
	PostUpvoteNotificationMixin,
	ReplyUpvoteNotificationMixin,
	MarkAsReadNotificationMixin,
	{
		classNames: ['wds-notification-card'],

		classNameBindings: ['isUnread:wds-is-unread'],

		tagName: 'li',

		currentUser: inject.service(),
		i18n: inject.service(),
		logger: inject.service(),
		notifications: inject.service(),

		userLanguage: computed.oneWay('currentUser.language'),

		iconName: computed('model.type', function () {
			const type = this.get('model.type');

			if (this.isDiscussionReply(type)) {
				return 'wds-icons-reply-small';
			} else if (this.isAnnouncement(type)) {
				return 'wds-icons-megaphone';
			} else {
				return 'wds-icons-upvote-small';
			}
		}),

		isUnread: computed.alias('model.isUnread'),

		postTitleMarkup: computed('model.title', function () {
			return wrapMeHelper.compute([
				this.get('model.title')
			], {
				tagName: 'b',
			});
		}),

		showSnippet: computed('model.title', 'model.type', function () {
			return !this.get('model.title') && this.isAnnouncement(this.get('model.type')) !== true;
		}),

		showLastActor: computed('model.type', function () {
			return this.isAnnouncement(this.get('model.type')) === true;
		}),

		postSnippetMarkup: computed('model.snippet', function () {
			return wrapMeHelper.compute([
				this.get('model.snippet')
			], {
				tagName: 'i',
			});
		}),

		text: computed('model', function () {
			const model = this.get('model'),
				type = model.type;

			if (this.isDiscussionReply(type)) {
				return this.getReplyMessageBody(model);
			} else if (this.isDiscussionPostUpvote(type)) {
				return this.getPostUpvoteMessageBody(model);
			} else if (this.isDiscussionReplyUpvote(type)) {
				return this.getReplyUpvoteMessageBody(model);
			} else if (this.isAnnouncement(type)) {
				return model.title;
			} else {
				this.get('logger').warn('No type found for a notification', model);
			}
		}),

		didInsertElement() {
			trackImpression(this.get('model'));
		},

		isDiscussionReply(type) {
			return type === notificationTypes.discussionReply;
		},

		isDiscussionReplyUpvote(type) {
			return type === notificationTypes.discussionUpvoteReply;
		},

		isDiscussionPostUpvote(type) {
			return type === notificationTypes.discussionUpvotePost;
		},

		isAnnouncement(type) {
			return type === notificationTypes.announcement;
		},

		showAvatars: computed('model.totalUniqueActors', 'model.type', function () {
			return this.get('model.totalUniqueActors') > 2 &&
				this.isDiscussionReply(this.get('model.type'));
		}),

		getTranslatedMessage(key, context) {
			const fullContext = $.extend({}, {
				// TODO: XW-1685 fix i18n for User's language
				// lng: this.get('userLanguage'),
				ns: 'design-system',
			}, context);

			return this.get('i18n').t(key, fullContext);
		},

		actions: {
			onNotificationClicked() {
				trackClick(this.get('model'));
			}
		}
	}
);
