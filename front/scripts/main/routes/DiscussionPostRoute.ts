/// <reference path="../app.ts" />
/// <reference path="../mixins/UseNewNavMixin.ts" />
/// <reference path="../mixins/DiscussionRouteUpvoteMixin.ts" />

'use strict';
App.DiscussionPostRoute = Em.Route.extend(App.UseNewNavMixin, App.DiscussionRouteUpvoteMixin, {
	/**
	 * @param {*} params
	 * @returns {Em.RSVP.Promise}
	 */
	model (params: any): Em.RSVP.Promise {
		return App.DiscussionPostModel.find(Mercury.wiki.id, params.postId);
	},

	/**
	 * @param {App.DiscussionPostModel} model
	 * @returns {undefined}
	 */
	afterModel (model: typeof App.DiscussionPostModel): void {
		var title: string = model.get('title');
		if (!title) {
			title = i18n.t('discussion.share-default-title', {siteName: Mercury.wiki.siteName});
		}
		this.controllerFor('application').set('currentTitle', title);
	},

	/**
	 * @returns {undefined}
	 */
	activate (): void {
		this.controllerFor('application').setProperties({
			// Enables vertical-colored theme bar in site-head component
			themeBar: true,
			enableShareHeader: false
		});
		this._super();
	},

	/**
	 * @returns {undefined}
	 */
	deactivate (): void {
		this.controllerFor('application').setProperties({
			// Disables vertical-colored theme bar in site-head component
			themeBar: false,
			enableShareHeader: false
		});
		this._super();
	},

	actions: {
		/**
		 * @returns {undefined}
		 */
		retry: function (): void {
			this.refresh();
		},

		/**
		 * @returns {undefined}
		 */
		goToAllDiscussions(): void {
			this.transitionTo('discussion.index');
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
		 * @returns {undefined}
		 */
		goToForum(forumId: number, sort: string): void {
			this.transitionTo('discussion.forum', forumId, sort);
		},
	}
});
