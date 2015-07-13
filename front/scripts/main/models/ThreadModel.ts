/// <reference path="../app.ts" />

App.ThreadModel = Em.Object.extend({
});

App.ThreadModel.reopenClass({
	find(wikiId: number, threadId: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax({
				url: `http://api.wikia-services.com/discussion/${wikiId}/threads/${threadId}?responseGroup=full`,
				dataType: 'json',
				success: (data) => resolve(data),
				error: (err) => reject(err)
			});
		});
	},
});
