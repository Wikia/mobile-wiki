import Ember from 'ember';
import DiscussionParsedContentMixin from '../mixins/discussion-parsed-content';

const {Component, computed} = Ember;

/**
 * Basic methods/properties for discussion-post-card-detail and discussion-post-card-reply.
 */
export default Component.extend(
	DiscussionParsedContentMixin,
	{
		classNameBindings: ['isNew', 'isDeleted', 'isReported', 'isLocked', 'showTopNote'],

		content: Ember.computed.oneWay('post.rawContent'),
		isDeleted: computed.alias('post.isDeleted'),
		isLocked: computed.oneWay('post.isLocked'),
		isNew: computed.oneWay('post.isNew'),
		isReported: computed.alias('post.isReported'),
		shouldActivateLinks: Ember.computed.alias('isDetailsView'),
		shouldTruncateContent: Ember.computed.not('isDetailsView'),

		showTopNote: computed('isDeleted', 'isReported', 'isLocked', function () {
			return this.get('isReported') || this.get('showRepliedTo') ||
				this.get('isLocked') || this.get('isDeleted');
		}),

		showLastEditedByMessage: computed(
			'post.lastEditedBy', 'post.lastEditedBy.id', 'post.createdBy.id', function () {
				return this.get('showLastEditedBy') && Boolean(this.get('post.lastEditedBy'))
					&& this.get('post.createdBy.id') !== this.get('post.lastEditedBy.id');
			}),

		lastEditedByMessage: computed('post.lastEditedBy.name', function () {
			const userName = this.getWithDefault('post.lastEditedBy.name', '');

			return this.get('post.userData.permissions.canModerate')
				? i18n.t('main.last-edited-by', {userName, ns: 'discussion'})
				: i18n.t('main.last-edited-by-administrators', {ns: 'discussion'});
		}),
	}
);
