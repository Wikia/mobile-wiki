import Ember from 'ember';

import DiscussionForumModel from '../models/discussion/forum';
import WidgetDiscussionsModel from '../models/widget-discussions';
import InViewportMixin from 'ember-in-viewport';

export default Ember.Component.extend(
	InViewportMixin,
	{
		classNames: ['widget-discussions'],
		classNameBindings: ['forumWrapper', 'discussion', 'forum'],
		discussion: true,
		forumWrapper: true,
		forum: true,

		data: null,
		isLoading: true,
		canShowCategories: true,

		model: Ember.computed(() => {
			return WidgetDiscussionsModel.create();
		}),

		/**
		 * @returns {void}
		 */
		didEnterViewport() {
			const categoryIds = this.get('categoryIds'),
				posts = DiscussionForumModel.find(
					Mercury.wiki.id,
					categoryIds,
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
