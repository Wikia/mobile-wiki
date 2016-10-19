import Ember from 'ember';
import request from 'ember-ajax/request';
import {track, trackActions} from '../utils/discussion-tracker';
import DiscussionPost from '../models/discussion/domain/post';
import DiscussionReply from '../models/discussion/domain/reply';
import OpenGraph from '../models/discussion/domain/open-graph';

export default Ember.Mixin.create({
	/**
	 * Create new post in Discussion Service
	 * @param {Object} postData
	 * @returns {Ember.RSVP.Promise}
	 */
	createPost(postData, forumId) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${forumId}/threads`), {
			data: JSON.stringify(postData),
			method: 'POST',
		}).then((thread) => {
			const newPost = DiscussionPost.createFromThreadData(thread);

			newPost.set('isNew', true);
			this.get('data.entities').insertAt(0, newPost);
			this.incrementProperty('postCount');

			track(trackActions.PostCreate);

			return newPost;
		});
	},

	/**
	 * @param {String} threadId
	 * @param {String} newCategoryId
	 * @returns {Ember.RSVP.Promise}
	 */
	movePost(threadId, newCategoryId) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${newCategoryId}/movethreads`), {
			data: JSON.stringify({
				threadIds: [threadId]
			}),
			dataType: 'text',
			method: 'POST'
		});
	},

	/**
	 * @param {Object} postData
	 * @returns {Ember.RSVP.Promise}
	 */
	editPostContent(postData) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${postData.threadId}`), {
			data: JSON.stringify(postData),
			method: 'POST',
		});
	},

	/**
	 * Edit a post in discussion service
	 * @param {Object} postData
	 * @param {Object} params
	 * @returns {Ember.RSVP.Promise}
	 */
	editPost(postData, params) {
		const promisesList = new Ember.A(),
			newCategoryId = params.newCategoryId,
			wasMoved = newCategoryId !== params.editedEntity.get('categoryId'),
			shouldEditContent = Ember.get(params, 'editedEntity.userData.permissions.canEdit');

		if (shouldEditContent) {
			promisesList.push(this.editPostContent(postData));
		}

		if (wasMoved) {
			promisesList.push(this.movePost(postData.threadId, newCategoryId));
		}

		return Ember.RSVP.all(promisesList).then((data) => {
			const editedPost = shouldEditContent ? DiscussionPost.createFromThreadData(data[0]) :
				Ember.Object.create({});

			if (wasMoved) {
				editedPost.setProperties({
					categoryId: newCategoryId,
					categoryName: params.newCategoryName
				});
			}

			this.updateData(editedPost, postData.id);

			track(trackActions.PostEditSave);

			return editedPost;
		});
	},

	/**
	 * @param {DiscussionPost} editedPost
	 * @param {string} postId
	 *
	 * @returns {void}
	 */
	updateData(editedPost, postId) {
		this.get('data.entities').findBy('id', postId).setProperties(editedPost);
	},

	/**
	 * Edit a reply in discussion service
	 * @param {Object} replyData
	 * @returns {Ember.RSVP.Promise}
	 */
	editReply(replyData) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/posts/${replyData.id}`), {
			data: JSON.stringify(replyData),
			method: 'POST',
		}).then((reply) => {
			let editedReply;

			reply.threadCreatedBy = reply.createdBy;
			editedReply = DiscussionReply.create(reply);

			this.get('data.entities').findBy('id', replyData.id).setProperties(editedReply);

			track(trackActions.ReplyEdit);

			return editedReply;
		});
	},

	/**
	 * @param {*} entity
	 * @returns {void}
	 */
	upvote(entity) {
		const entityId = entity.get('id'),
			hasUpvoted = entity.get('userData.hasUpvoted'),
			method = hasUpvoted ? 'delete' : 'post';

		if (this.upvotingInProgress[entityId]) {
			return null;
		}

		if (!entity.get('userData')) {
			track(trackActions.AnonUpvotePost);

			return null;
		}

		this.upvotingInProgress[entityId] = true;

		// the change in the front-end is done here
		entity.set('userData.hasUpvoted', !hasUpvoted);

		request(M.getDiscussionServiceUrl(`/${Ember.get(Mercury, 'wiki.id')}/votes/post/${entity.get('id')}`), {
			method,
		}).then((data) => {
			entity.set('upvoteCount', data.upvoteCount);

			if (hasUpvoted) {
				track(trackActions.UndoUpvotePost);
			} else {
				track(trackActions.UpvotePost);
			}
		}).catch(() => {
			entity.set('userData.hasUpvoted', hasUpvoted);
		}).finally(() => {
			this.upvotingInProgress[entityId] = false;
		});
	},


	/**
	 *
	 * @param {object} currentUser
	 * @param {*} entity
	 * @returns {void}
	 */
	follow(currentUser, entity) {
		const isFollowing = entity.get('isFollowing'),
			method = isFollowing ? 'delete' : 'put';

		entity.set('isFollowing', !isFollowing);

		request(M.getFollowingServiceUrl(`/followers/${currentUser.get('userId')}/items/${entity.get('id')}/type/post`), {
			method
		}).then((data) => {
			track(isFollowing ? trackActions.UnfollowPost : trackActions.FollowPost);
		}).catch(() => {
			entity.set('isFollowing', isFollowing);
		}).finally(() => {

		});
	},

	/**
	 * Generate Open Graph data in the service
	 *
	 * @param {string} uri
	 *
	 * @returns {Ember.RSVP.Promise}
	 */
	generateOpenGraph(uri) {
		return request(M.getOpenGraphServiceUrl('/'), {
			data: {
				uri
			},
			method: 'GET',
		}).then((openGraphApiData) => {
			return OpenGraph.create(openGraphApiData);
		});
	},
});
