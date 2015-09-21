/// <reference path="../app.ts" />
'use strict';

/**
 * Handles posts upvoting.
 * If the post was upvoted already, the upvote is removed.
 */
App.DiscussionUpvoteMixin = Em.Mixin.create({
	upvotingInProgress: {},

	upvotePost(post: typeof App.DiscussionPostModel): void {
		var hasUpvoted: boolean,
			method: string,
			oldUpvoteCount: number = Em.get(post, 'upvoteCount'),
			postId: number = Em.get(post, 'id');

		if (this.upvotingInProgress[postId] || Em.get(post, '_embedded') === undefined ||
			Em.get(post._embedded, 'userData') === undefined) {
			return null;
		}

		this.upvotingInProgress[postId] = true;
		hasUpvoted = Em.get(post._embedded.userData[0], 'hasUpvoted');
		method = (hasUpvoted ? 'delete' : 'post');

		// assuming the positive scenario, the change in the front-end is dome here
		Em.set(post, 'upvoteCount', oldUpvoteCount + (hasUpvoted ? -1 : 1));
		Em.set(post._embedded.userData[0], 'hasUpvoted', !hasUpvoted);

		Em.$.ajax({
			method: method,
			url: 'https://' + M.prop('servicesDomain') +
			'/discussion/' + post.siteId + '/votes/post/' + post.id,
			dataType: 'json',
			xhrFields: {
				withCredentials: true,
			},
			success: (data: any): void => {
				Em.set(post, 'upvoteCount', data.upvoteCount);
			},
			error: (err: any): void => {
				// @TODO: handle errors

				Em.set(post, 'upvoteCount', oldUpvoteCount);
				Em.set(post._embedded.userData[0], 'hasUpvoted', !Em.get(post._embedded.userData[0], 'hasUpvoted'));
			},
			complete: (): void => {
				this.upvotingInProgress[postId] = false;
			}
		});
	}
});
