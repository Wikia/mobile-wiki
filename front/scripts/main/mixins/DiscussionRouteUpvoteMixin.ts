/// <reference path="../app.ts" />
'use strict';

/**
 * Handles posts upvoting.
 * If the post was upvoted already, the upvote is removed.
 */
App.DiscussionRouteUpvoteMixin = Em.Mixin.create({
	upvotingInProgress: {},

	actions: {
		upvote(post: any): void {
			var hasUpvoted: boolean,
				method: string,
				postId: number = Em.get(post, 'id');

			if (this.upvotingInProgress[postId] || Em.get(post, '_embedded.userData') === undefined) {
				return null;
			}

			this.upvotingInProgress[postId] = true;
			hasUpvoted = Em.get(post._embedded.userData[0], 'hasUpvoted');
			method = hasUpvoted ? 'delete' : 'post';

			// the change in the front-end is done here
			Em.set(post._embedded.userData[0], 'hasUpvoted', !hasUpvoted);

			Em.$.ajax(<JQueryAjaxSettings>{
				method: method,
				url: 'https://' + M.prop('servicesDomain') +
				'/discussion/' + Em.get(post, 'siteId') + '/votes/post/' + Em.get(post, 'id'),
				dataType: 'json',
				xhrFields: {
					withCredentials: true,
				},
				success: (data: any): void => {
					Em.set(post, 'upvoteCount', data.upvoteCount);
				},
				error: (): void => {
					Em.set(post._embedded.userData[0], 'hasUpvoted', hasUpvoted)
				},
				complete: (): void => {
					this.upvotingInProgress[postId] = false;
				}
			});
		}
	}
});
