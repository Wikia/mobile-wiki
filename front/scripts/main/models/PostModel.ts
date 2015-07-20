/// <reference path="../app.ts" />

App.PostModel = Em.Object.extend({
});

App.PostModel.reopenClass({
	find(wikiId: number, threadId: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax({
				url: `http://api.wikia-services.com/discussion-test/${wikiId}/threads/${threadId}?responseGroup=full&sortDirection=ascending`,
				dataType: 'json',
				success: (data) => resolve(data),
				error: (err) => reject(err)
			});
		});
	},
});
