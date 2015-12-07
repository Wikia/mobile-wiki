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

	/**
	 * @param {string} sortBy
	 * @returns {EmberStates.Transition}
	 */
	setSortBy(sortBy) {
		const controller = this.controllerFor('discussionForum');

		controller.set('sortBy', sortBy);

		if (controller.get('sortAlwaysVisible') !== true) {
			this.controllerFor('discussionForum').set('sortVisible', false);
		}

		return this.transitionTo('discussion.forum', this.get('forumId'), sortBy);
	},

	actions: {
		/**
		 * @param {number} postId
		 * @returns {void}
		 */
		goToPost(postId, openInNewTab = false) {
			const postController = this.controllerFor('discussionPost'),
				forumController = this.controllerFor('discussionForum');

			postController.set('postListSort', forumController.get('sortBy'));
			//const newTabURL= Ember.get('router');
			console.log('DISCUSSION FORUM');
			if(openInNewTab) {

			} else {
				this.transitionTo('discussion.post', postId);
			}
		},

		/**
		 * @param {number} pageNum
		 * @returns {void}
		 */
		loadPage(pageNum) {
			const sortBy = this.controllerFor('discussionForum').get('sortBy') || this.defaultSortType;

			this.modelFor('discussion.forum').loadPage(pageNum, sortBy);
		},

		create(postData) {
			this.setSortBy('latest').promise.then(() => {
				this.modelFor('discussion.forum').createPost(postData);
			});
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
			this.setSortBy(sortBy);
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
