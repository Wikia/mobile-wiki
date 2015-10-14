/// <reference path="../app.ts" />

App.DiscussionPostModel = Em.Object.extend({
	wikiId: null,
	postId: null,
	forumId: null,
	pivotId: null,
	replyLimit: 10,
	replies: [],
	firstPost: null,
	upvoteCount: 0,
	postCount: 0,
	page: 0,
	contributors: [],

	loadNextPage() {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: 'https://' + M.prop('servicesDomain') + '/discussion/' +
					 this.wikiId + '/threads/' + this.postId +
					 '?responseGroup=full' +
					 '&sortDirection=descending&sortKey=creation_date' +
					 '&limit=' + this.replyLimit +
					 '&pivot=' + this.pivotId +
					 '&page=' + (this.page + 1),
				dataType: 'json',
				success: (data: any) => {
					var newReplies = data._embedded['doc:posts'];

					// Note that we have to reverse the list we get back because how we're displaying
					// replies on the page; we want to see the newest replies first but show them
					// starting with oldest of the current list at the top.
					newReplies.reverse();
					newReplies = newReplies.concat(this.replies);

					this.setProperties({
						replies: newReplies,
						page: this.page+1
					});

					resolve(this);
				},
				error: (err: any) => reject(err)
			});
		});
	}
});

App.DiscussionPostModel.reopenClass({
	find(wikiId: number, postId: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			var postInstance = App.DiscussionPostModel.create({
				wikiId: wikiId,
				postId: postId
			});

			Em.$.ajax(<JQueryAjaxSettings>{
				url: 'https://' + M.prop('servicesDomain') +
					 `/discussion/${wikiId}/threads/${postId}` +
					 '?responseGroup=full&sortDirection=descending&sortKey=creation_date' +
					 '&limit=' + postInstance.replyLimit,
				dataType: 'json',
				xhrFields: {
					withCredentials: true,
				},
				success: (data: any) => {
					var contributors: any[] = [],
						replies = data._embedded['doc:posts'],
						pivotId: number;
					// If there are no replies to the first post, 'doc:posts' will not be returned
					if (replies) {
						pivotId = replies[0].id;
						// See note in previous reverse above on why this is necessary
						replies.reverse();
					}

					replies.forEach(function (reply: any) {
						var author: any;
						if (reply.hasOwnProperty('createdBy')) {
							author = reply.createdBy;
							author.url = M.buildUrl({
								namespace: 'User',
								title: author.name
							});
							contributors.push(author);
						}
					});

					postInstance.setProperties({
						contributors: contributors,
						forumId: data.forumId,
						replies: replies,
						firstPost: data._embedded.firstPost[0],
						upvoteCount: data.upvoteCount,
						postCount: data.postCount,
						id: data.id,
						pivotId: pivotId,
						page: 0,
						title: data.title
					});
					resolve(postInstance);
				},
				error: (err: any) => reject(err)
			});
		});
	}
});
