App.DiscussionIndexRoute = Em.Route.extend(App.UseNewNavMixin, {
	/**
	 * @returns {void}
	 */
	beforeModel() {
		const controller = this.controllerFor('discussionForum');

		this.transitionTo('discussion.forum', Mercury.wiki.id, controller.get('sortTypes')[0].name);
	},

	/**
	 * @returns {*}
	 */
	model() {
		return App.DiscussionIndexModel.find(Mercury.wiki.id);
	}
});
