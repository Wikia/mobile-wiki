import Ember from 'ember';

import DiscussionForumModel from '../models/discussion/forum';

import DiscussionContributionModelMixin from '../mixins/discussion-contribution-model';

export default Ember.Component.extend(
  DiscussionContributionModelMixin,
	{
		classNameBindings: ['forumWrapper', 'discussion', 'forum'],
		classNames: ['widget-discussions'],
		data: null,
		discussion: true,
		forumWrapper: true,
		forum: true,
		upvotingInProgress: {},

		title: Ember.computed('title', () => {
			return i18n.t('main.discussions-header-title', {ns: 'discussion'});
		}),

		viewAllPosts: Ember.computed('title', () => {
			return i18n.t('main.all-discussions-link-mobile', {ns: 'discussion'});
		}),

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			const posts = DiscussionForumModel.find(Mercury.wiki.id, [], this.get('show'));

			posts.then((result) => {
				const entities = result.data.entities.slice(0, this.get('itemCount'));
				this.set('posts', entities);
			});
		},

		actions: {
			upvote(entity) {
				this.upvote(entity);
			},

			// Placeholders. These action must be present for discussion-post-card-detail to render,
			// but are not used directly by this component
			delete() {},
			lock() {},
			openEditEditor() {},
			report() {},
			undelete() {},
			unlock() {},
			setEditorActive() {},
			reply() {},
			share() {},
		}
	}
);
