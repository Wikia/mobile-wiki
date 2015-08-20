/// <reference path="../app.ts" />

App.DiscussionPostModel = Em.Object.extend({
	replies: [],
	firstPost: null,
	upvoteCount: 0,
	postCount: 0
});

App.DiscussionPostModel.reopenClass({
	find(wikiId: number, threadId: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			var postInstance = App.DiscussionPostModel.create();

			Em.$.ajax({
				url: `https://services.wikia.com/discussion/${wikiId}/threads/${threadId}` +
					 '?responseGroup=full&sortDirection=descending&limit=10',
				dataType: 'json',
				success: (data: any) => {
					postInstance.setProperties({
						replies: data._embedded['doc:posts'],
						firstPost: data._embedded.firstPost[0],
						upvoteCount: data.upvoteCount,
						postCount: data.postCount
					});
					resolve(postInstance);
				},
				error: (err: any) => reject(err)
			});
		});
	},
});
