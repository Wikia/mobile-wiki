/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionLayoutMixin.ts" />
/// <reference path="../mixins/DiscussionRouteUpvoteMixin.ts" />

'use strict';

App.DiscussionPostRoute = Em.Route.extend(App.DiscussionLayoutMixin, App.DiscussionRouteUpvoteMixin, {
	/**
	 * @param {*} params
	 * @returns {Em.RSVP.Promise}
	 */
	model(params: any): Em.RSVP.Promise {
		return App.DiscussionPostModel.find(Mercury.wiki.id, params.postId);
	},

	/**
	 * @param {App.DiscussionPostModel} model
	 * @returns {void}
	 */
	afterModel(model: typeof App.DiscussionPostModel): void {
		var title: string = model.get('title');
		if (!title) {
			title = i18n.t('main.share-default-title', {siteName: Mercury.wiki.siteName, ns:'discussion'});
		}
		this.controllerFor('application').set('currentTitle', title);
	},

	/**
	 * @returns {void}
	 */
	activate(): void {
		this.controllerFor('application').setProperties({
			// Enables vertical-colored theme bar in site-head component
			themeBar: true,
			enableShareHeader: false
		});
		this._super();
	},

	/**
	 * @returns {void}
	 */
	deactivate(): void {
		this.controllerFor('application').setProperties({
			// Disables vertical-colored theme bar in site-head component
			themeBar: false,
			enableShareHeader: false
		});
		this._super();
	},

	actions: {
		/**
		 * @returns {void}
		 */
		retry(): void {
			this.refresh();
		},

		/**
		 * @returns {void}
		 */
		goToAllDiscussions(): void {
			this.transitionTo('discussion.index');
		},

		/**
		 * Triggers new reply creation on a model
		 * @param postData
		 */
		createReply(replyData: any): any {
			this.modelFor('discussion.post').createReply(replyData);
		},

		/**
		 * @returns {boolean}
		 */
		didTransition(): boolean {
			this.controllerFor('application').set('noMargins', true);
			return true;
		},

		/**
		 * @param {number} forumId
		 * @param {string} sort
		 * @returns {void}
		 */
		goToForum(forumId: number, sort: string): void {
			this.transitionTo('discussion.forum', forumId, sort);
		},
	}
});
