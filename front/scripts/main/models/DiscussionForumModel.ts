/// <reference path="../app.ts" />

App.DiscussionForumModel = Em.Object.extend({
	wikiId: null,
	forumId: null,
	name: null,
	posts: null,
	totalPosts: 0,

	hasMore: function(): boolean {
		return this.totalPosts > this.posts.length;
	},

	loadPage(pageNum: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax({
				url: 'https://services.wikia.com/discussion/' + this.wikiId + '/forums/' + this.forumId +
					 '?page=' + pageNum,
				dataType: 'json',
				success: (data: any) => {
					var newPosts = data._embedded['doc:threads'],
					    allPosts = this.posts.concat(newPosts);

					this.setProperties({
						posts: allPosts,
					});

					resolve(this);
				},
				error: (err: any) => reject(err)
			});
		});
	}
});

App.DiscussionForumModel.reopenClass({
	find(wikiId: number, forumId: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			var forumInstance = App.DiscussionForumModel.create({
				wikiId: wikiId,
				forumId: forumId
			});

			Em.$.ajax({
				url: `https://services.wikia.com/discussion/${wikiId}/forums/${forumId}`,
				dataType: 'json',
				success: (data: any) => {
					var posts = data._embedded['doc:threads'],
						totalPosts = data.threadCount;

					forumInstance.setProperties({
						name: data.name,
						posts: posts,
						totalPosts: totalPosts
					});

					resolve(forumInstance);
				},
				error: (err) => reject(err)
			});
		});
	},
});
