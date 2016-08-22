import Ember from 'ember';

import DiscussionForumModel from '../models/discussion/forum';

import DiscussionContributionModelMixin from '../mixins/discussion-contribution-model';

export default Ember.Component.extend(
  DiscussionContributionModelMixin,
	{
		classNames: ['widget-discussions'],
		layoutName: 'components/widget-discussions',
		data: null,
		upvotingInProgress: {},

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			const posts = DiscussionForumModel.find(Mercury.wiki.id, [], this.get('show'));

			$('.widget-discussions').addClass('forum-wrapper discussion forum');

			posts.then((result) => {
				const entities = result.data.entities.slice(0, this.get('itemCount'));
				this.set('posts', entities);
				this.set('title', i18n.t('main.discussions-header-title', {ns: 'discussion'}));
				this.set('view-all', i18n.t('main.all-discussions-link-mobile', {ns: 'discussion'}));
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
