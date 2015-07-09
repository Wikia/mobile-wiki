/// <reference path="../app.ts" />

App.ThreadModel = Em.Object.extend({
});

App.ThreadModel.reopenClass({
	find(wikiId: number, threadId: number) {
		return new Em.RSVP.Promise((resolve: Function, reject: Function) => {
			Em.$.ajax({
				url: `http://api.wikia-services.com/discussion/${wikiId}/threads/${threadId}?responseGroup=full`,
				dataType: 'json',
/*
				success: function (data) {
					var posts = [];

					console.log(posts);
					data._embedded['doc:posts'].forEach(function(postData) {
						var post = App.PostModel.newFromData(postData);
						posts.push(post);
					});
					console.log(posts);

					return resolve({posts: posts});
				},
*/
				success: (data) => resolve(data),
				error: (err) => reject(err)
			});
		});
	},
});
