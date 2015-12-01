import App from '../app';
import DiscussionRouteUpvoteMixin from '../mixins/discussion-route-upvote';
import DiscussionForumModel from '../models/discussion-forum';
import DiscussionLayoutMixin from '../mixins/discussion-layout';

export default App.DiscussionForumRoute = Ember.Route.extend(DiscussionLayoutMixin, DiscussionRouteUpvoteMixin, {
	defaultSortType: null,
	forumId: null,

	/**
	 * @param {*} params
	 * @returns {*}
	 */
	model(params) {
		const sortBy = params.sortBy || this.defaultSortType;

		this.set('forumId', params.forumId);

		return DiscussionForumModel.find(Mercury.wiki.id, params.forumId, sortBy);
	},

	/**
	 * @param {Ember.Controller} controller
	 * @param {Ember.Object} model
	 * @param {EmberStates.Transition} transition
	 * @returns {void}
	 */
	setupController(controller, model, transition) {
		this._super(controller, model, transition);
		this.defaultSortType = controller.get('sortTypes')[0].name;
		controller.set('sortBy', transition.params['discussion.forum'].sortBy || this.defaultSortType);
	},

	actions: {
		/**
		 * @param {number} postId
		 * @returns {void}
		 */
		goToPost(postId) {
			const postController = this.controllerFor('discussionPost'),
				forumController = this.controllerFor('discussionForum');

			postController.set('postListSort', forumController.get('sortBy'));

			this.transitionTo('discussion.post', postId);
		},

		/**
		 * @param {number} pageNum
		 * @returns {void}
		 */
		loadPage(pageNum) {
			const sortBy = this.controllerFor('discussionForum').get('sortBy') || this.defaultSortType;

			this.modelFor('discussion.forum').loadPage(pageNum, sortBy);
		},

		/**
		 * Pass post deletion to model
		 * @returns {void}
		 */
		deletePost(post) {
			this.modelFor('discussion.forum').deletePost(post);
		},

		/**
		 * Pass post undeletion to model
		 * @returns {void}
		 */
		undeletePost(post) {
			this.modelFor('discussion.forum').undeletePost(post);
		},

		/**
		 * @returns {void}
		 */
		retry() {
			this.refresh();
		},

		/**
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.transitionTo('discussion.index');
		},

		/**
		 * @param {string} sortBy
		 * @returns {void}
		 */
		setSortBy(sortBy) {
			const controller = this.controllerFor('discussionForum');

			controller.set('sortBy', sortBy);

			if (controller.get('sortAlwaysVisible') !== true) {
				this.controllerFor('discussionForum').set('sortVisible', false);
			}

			this.transitionTo('discussion.forum', this.get('forumId'), sortBy);
		},

		/**
		 * @returns {boolean}
		 */
		didTransition() {
			this.controllerFor('application').set('noMargins', true);
			return true;
		}
	}
});
