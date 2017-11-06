define('mobile-wiki/components/notification-card', ['exports', 'mobile-wiki/helpers/wrap-me', 'mobile-wiki/mixins/new-reply-notification', 'mobile-wiki/mixins/post-upvote-notification', 'mobile-wiki/mixins/reply-upvote-notification', 'mobile-wiki/mixins/mark-as-read-notification', 'mobile-wiki/utils/notifications-tracker', 'mobile-wiki/utils/notification-types'], function (exports, _wrapMe, _newReplyNotification, _postUpvoteNotification, _replyUpvoteNotification, _markAsReadNotification, _notificationsTracker, _notificationTypes) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	var service = Ember.inject.service;
	var oneWay = Ember.computed.oneWay;
	var alias = Ember.computed.alias;
	var Component = Ember.Component;
	var computed = Ember.computed;
	exports.default = Component.extend(_newReplyNotification.default, _postUpvoteNotification.default, _replyUpvoteNotification.default, _markAsReadNotification.default, {
		classNames: ['wds-notification-card'],

		classNameBindings: ['isUnread:wds-is-unread'],

		tagName: 'li',

		currentUser: service(),
		i18n: service(),
		logger: service(),
		notifications: service(),

		userLanguage: oneWay('currentUser.language'),

		iconName: computed('model.type', function () {
			var type = this.get('model.type');

			if (this.isDiscussionReply(type)) {
				return 'wds-icons-reply-small';
			} else if (this.isAnnouncement(type)) {
				return 'wds-icons-megaphone';
			} else {
				return 'wds-icons-upvote-small';
			}
		}),

		isUnread: alias('model.isUnread'),

		postTitleMarkup: computed('model.title', function () {
			return _wrapMe.default.compute([this.get('model.title')], {
				tagName: 'b'
			});
		}),

		showSnippet: computed('model.title', 'model.type', function () {
			return !this.get('model.title') && this.isAnnouncement(this.get('model.type')) !== true;
		}),

		showLastActor: computed('model.type', function () {
			return this.isAnnouncement(this.get('model.type')) === true;
		}),

		postSnippetMarkup: computed('model.snippet', function () {
			return _wrapMe.default.compute([this.get('model.snippet')], {
				tagName: 'i'
			});
		}),

		text: computed('model', function () {
			var model = this.get('model'),
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

		didInsertElement: function didInsertElement() {
			(0, _notificationsTracker.trackImpression)(this.get('model'));
		},
		isDiscussionReply: function isDiscussionReply(type) {
			return type === _notificationTypes.default.discussionReply;
		},
		isDiscussionReplyUpvote: function isDiscussionReplyUpvote(type) {
			return type === _notificationTypes.default.discussionUpvoteReply;
		},
		isDiscussionPostUpvote: function isDiscussionPostUpvote(type) {
			return type === _notificationTypes.default.discussionUpvotePost;
		},
		isAnnouncement: function isAnnouncement(type) {
			return type === _notificationTypes.default.announcement;
		},


		showAvatars: computed('model.totalUniqueActors', 'model.type', function () {
			return this.get('model.totalUniqueActors') > 2 && this.isDiscussionReply(this.get('model.type'));
		}),

		getTranslatedMessage: function getTranslatedMessage(key, context) {
			var fullContext = $.extend({}, {
				// TODO: XW-1685 fix i18n for User's language
				// lng: this.get('userLanguage'),
				ns: 'design-system'
			}, context);

			return this.get('i18n').t(key, fullContext);
		},


		actions: {
			onNotificationClicked: function onNotificationClicked() {
				(0, _notificationsTracker.trackClick)(this.get('model'));
			}
		}
	});
});