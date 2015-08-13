/// <reference path="../app.ts" />

App.PostModel = Em.Object.extend({
	wikiId: null,
	threadId: null,
	pivotId: null,
	replyLimit: 10,
	replies: [],
	firstPost: null,
	upvoteCount: 0,
	postCount: 0,
	page: null,

	loadNextPage() {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax({
				url: 'http://api.wikia-services.com' +
				'/discussion-test/' + this.wikiId + '/threads/' + this.threadId +
				'?responseGroup=full' +
				'&sortDirection=descending' +
				'&limit=' + this.replyLimit +
				'&pivot=' + this.pivotId +
				'&page=' + (this.page+1),
				dataType: 'json',
				success: (data: any) => {
					var newReplies = data._embedded['doc:posts'];

					// @todo dev testing remove
					for (i=0; i<newReplies.length; i++) {
						var entry = newReplies[i];
						entry.timeDiff = entry.creationDate.epochSecond - data._embedded.firstPost[0].creationDate.epochSecond;
					}
					newReplies.reverse();

					this.setProperties({
						replies: newReplies.concat(this.replies),
						page: this.page+1
					});

					resolve(this);
				},
				error: (err: any) => reject(err)
			});
		});
	}
});

App.PostModel.reopenClass({
	find(wikiId: number, threadId: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			var postInstance = App.PostModel.create({
				wikiId: wikiId,
				threadId: threadId
			});

			Em.$.ajax({
				url: `https://services.wikia-dev.com/discussion/${wikiId}/threads/${threadId}` +
					 '?responseGroup=full&sortDirection=descending&limit=' + postInstance.replyLimit,

				dataType: 'json',
				success: (data: any) => {
					var replies = data._embedded['doc:posts'],
						pivotId = replies[0].id,
						i;

					// @todo dev testing remove
					for (i=0; i<replies.length; i++) {
						var entry = replies[i];
						entry.timeDiff = entry.creationDate.epochSecond - data._embedded.firstPost[0].creationDate.epochSecond;
					}

					replies.reverse();

					postInstance.setProperties({
						replies: replies,
						firstPost: data._embedded.firstPost[0],
						upvoteCount: data.upvoteCount,
						postCount: data.postCount,
						pivotId: pivotId,
						page: 0
					});
					resolve(postInstance);
				},
				error: (err: any) => reject(err)
			});
		});
	},
});
