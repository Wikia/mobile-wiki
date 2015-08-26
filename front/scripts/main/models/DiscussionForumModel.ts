/// <reference path="../app.ts" />

App.DiscussionForumModel = Em.Object.extend({
});

App.DiscussionForumModel.reopenClass({
	find(wikiId: number, forumId: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax({
				url: `https://services.wikia.com/discussion/${wikiId}/forums/${forumId}`,
				dataType: 'json',
				success: (data) => resolve(data),
				error: (err) => reject(err)
			});
		});
	},
});
