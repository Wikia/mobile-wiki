/// <reference path="../app.ts" />

App.DiscussionPostModel = App.DiscussionBaseModel.extend({
	postId: null,
	pivotId: null,
	replyLimit: 10,
	replies: [],
	firstPost: null,
	upvoteCount: 0,
	postCount: 0,
	page: 0,
	contributors: [],

	/**
	 * @returns {Em.RSVP.Promise}
	 */
	loadNextPage() {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${this.postId}`,
					{
						'responseGroup': 'full',
						'sortDirection': 'descending',
						'sortKey': 'creation_date',
						'limit': this.replyLimit,
						'pivot': this.pivotId,
						'page': this.page + 1,
						'viewableOnly': false
					}),
				xhrFields: {
					withCredentials: true,
				},
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
				error: (err: any) => {
					this.handleLoadMoreError(err);
					resolve(this);
				}
			});
		});
	}
});

App.DiscussionPostModel.reopenClass({
	/**
	 * @param {number} wikiId
	 * @param {number} postId
	 * @returns {Em.RSVP.Promise}
	 */
	find(wikiId: number, postId: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			var postInstance = App.DiscussionPostModel.create({
				wikiId: wikiId,
				postId: postId
			});

			Em.$.ajax(<JQueryAjaxSettings>{
				url: M.getDiscussionServiceUrl(`/${wikiId}/threads/${postId}`,
					{
						'responseGroup': 'full',
						'sortDirection': 'descending',
						'sortKey': 'creation_date',
						'limit': postInstance.replyLimit,
						'viewableOnly': false
					}),
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

						replies.forEach(function (reply: any) {
							if (reply.hasOwnProperty('createdBy')) {
								reply.createdBy.profileUrl = M.buildUrl({
									namespace: 'User',
									title: reply.createdBy.name
								});
								contributors.push(reply.createdBy);
							}
						});
					}

					postInstance.setProperties({
						contributors: contributors,
						firstPost: data._embedded.firstPost[0],
						forumId: data.forumId,
						id: data.id,
						isDeleted: data.isDeleted,
						page: 0,
						pivotId: pivotId,
						postCount: data.postCount,
						replies: replies,
						title: data.title,
						upvoteCount: data.upvoteCount,
					});
					resolve(postInstance);
				},
				error: (err: any) => {
					postInstance.setErrorProperty(err);
					resolve(postInstance);
				}
			});
		});
	}
});
