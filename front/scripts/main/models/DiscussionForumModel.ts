/// <reference path="../app.ts" />
/// <reference path="../mixins/DiscussionErrorMixin.ts" />

App.DiscussionForumModel = Em.Object.extend(App.DiscussionErrorMixin, {
	wikiId: null,
	forumId: null,
	name: null,
	posts: null,
	totalPosts: 0,

	connectionError: null,
	notFoundError: null,
	contributors: [],

	loadPage(pageNum: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax(<JQueryAjaxSettings>{
				url: M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.forumId}`),
				data: {
					page: pageNum
				},
				dataType: 'json',
				success: (data: any) => {
					var newPosts = data._embedded['doc:threads'],
						allPosts = this.posts.concat(newPosts);

					this.set('posts', allPosts);

					resolve(this);
				},
				error: (err: any) => {
					this.setErrorProperty(err, this);
					resolve(this);
				}
			});
		});
	},

	getSortKey(sortBy: string): string {
		switch (sortBy) {
			case 'latest':
				return 'creation_date';
			case 'trending':
				return 'trending';
			default:
				return '';
		}
	}
});

App.DiscussionForumModel.reopenClass({
	find(wikiId: number, forumId: number, sortBy: string) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			var forumInstance = App.DiscussionForumModel.create({
					wikiId: wikiId,
					forumId: forumId
				}),
				requestData: any = {};

			if (sortBy) {
				requestData.sortKey = forumInstance.getSortKey(sortBy);
			}

			Em.$.ajax(<JQueryAjaxSettings>{
				url: M.getDiscussionServiceUrl(`/${wikiId}/forums/${forumId}`),
				data: requestData,
				dataType: 'json',
				xhrFields: {
					withCredentials: true,
				},
				success: (data: any) => {
					var contributors: any[] = [],
						posts = data._embedded['doc:threads'],
						totalPosts = data.threadCount;

					posts.forEach(function (post: any) {
						var author: any;
						if (post.hasOwnProperty('createdBy')) {
							author = post.createdBy;
							author.url = M.buildUrl({
								namespace: 'User',
								title: author.name
							});
							contributors.push(author);
						}
					});

					forumInstance.setProperties({
						contributors: contributors,
						name: data.name,
						posts: posts,
						totalPosts: totalPosts
					});
					resolve(forumInstance);
				},
				error: (err: any) => {
					forumInstance.setErrorProperty(err, forumInstance);
					resolve(forumInstance);
				}
			});
		});
	}
});
