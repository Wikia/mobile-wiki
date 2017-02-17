import Ember from 'ember';
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
			const categoryIds = this.getWithDefault('categoryIds', []),
				posts = DiscussionForumModel.find(
					Mercury.wiki.id,
					categoryIds,
					this.get('show'),
					this.get('itemCount')
				);

			posts.then((result) => {
				this.setProperties({
					posts: result.posts,
					isLoading: false,
				});
			});
		},

		actions: {
			upvote(post) {
				this.get('model').upvote(post);
			},
		}
	}
);
