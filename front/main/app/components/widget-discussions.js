import Ember from 'ember';

import DiscussionForumModel from '../models/discussion/forum';
import WidgetDiscussionsModel from '../models/widget-discussions';

export default Ember.Component.extend(
	{
		classNames: ['widget-discussions'],
		classNameBindings: ['forumWrapper', 'discussion', 'forum'],
		discussion: true,
		forumWrapper: true,
		forum: true,

		data: null,
		isLoading: true,

		model: Ember.computed('model', () => {
			return WidgetDiscussionsModel.create();
		}),

		title: Ember.computed('title', () => {
			return i18n.t('main.discussions-header-title', {ns: 'discussion'});
		}),

		viewAllPosts: Ember.computed('viewAllPosts', () => {
			return i18n.t('main.all-discussions-link-mobile', {ns: 'discussion'});
		}),

		/**
		 * @returns {void}
		 */
		didInsertElement() {
			const category = this.get('category'),
				posts = DiscussionForumModel.find(
					Mercury.wiki.id,
					category ? [category] : [],
					this.get('show')
				);

			posts.then((result) => {
				this.setProperties({
					posts: result.data.entities.slice(0, this.get('itemCount')),
					isLoading: false,
				});
			});
		},

		actions: {
			upvote(entity) {
				this.get('model').upvote(entity);
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
