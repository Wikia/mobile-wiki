
import Mercury from '../../mercury/Mercury';
import DiscussionPostModel from '../models/discussion-post';
import DiscussionRouteUpvoteMixin from '../mixins/discussion-route-upvote';

const DiscussionPostRoute = Ember.Route.extend(DiscussionRouteUpvoteMixin, {
	/**
	 * @param {*} params
	 * @returns {Ember.RSVP.Promise}
	 */
	model(params) {
		return DiscussionPostModel.find(Mercury.wiki.id, params.postId);
	},

	/**
	 * @param {DiscussionPostModel} model
	 * @returns {void}
	 */
	afterModel(model) {
		let title = model.get('title');

		if (!title) {
			title = i18n.t('discussion.share-default-title', {siteName: Mercury.wiki.siteName});
		}

		this.controllerFor('application').set('currentTitle', title);
	},

	/**
	 * @returns {void}
	 */
	activate() {
		this.controllerFor('application').setProperties({
			// Enables vertical-colored theme bar in site-head component
			themeBar: true,
			enableShareHeader: false
		});
		Ember.$('body').addClass('discussions');
		this._super();
	},

	/**
	 * @returns {void}
	 */
	deactivate() {
		this.controllerFor('application').setProperties({
			// Disables vertical-colored theme bar in site-head component
			themeBar: false,
			enableShareHeader: false
		});
		Ember.$('body').removeClass('discussions');
		this._super();
	},

	actions: {
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
		 * @returns {boolean}
		 */
		didTransition() {
			this.controllerFor('application').set('noMargins', true);
			return true;
		},

		/**
		 * @param {number} forumId
		 * @param {string} sort
		 * @returns {void}
		 */
		goToForum(forumId, sort) {
			this.transitionTo('discussion.forum', forumId, sort);
		},
	}
});

export default DiscussionPostRoute;
