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
	createPost(postData) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/forums/${this.wikiId}/threads`), {
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
	 * Edit a post in discussion service
	 * @param {Object} postData
	 * @returns {Ember.RSVP.Promise}
	 */
	editPost(postData) {
		return request(M.getDiscussionServiceUrl(`/${this.wikiId}/threads/${postData.threadId}`), {
			data: JSON.stringify(postData),
			method: 'POST',
		}).then((thread) => {
			const editedPost = DiscussionPost.createFromThreadData(thread);

			this.get('data.entities').findBy('id', postData.id).setProperties(editedPost);

			track(trackActions.PostEditSave);

			return editedPost;
		});
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
