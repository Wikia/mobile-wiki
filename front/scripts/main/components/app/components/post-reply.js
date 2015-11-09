App.PostReplyComponent = Em.Component.extend(
	App.DiscussionUpvoteActionSendMixin,
	{
		classNames: ['post-reply'],
		post: null,

		authorUrl: Em.computed('post', function () {
			return M.buildUrl({
				namespace: 'User',
				title: this.get('post.createdBy.name'),
			});
		}),
	}
);
