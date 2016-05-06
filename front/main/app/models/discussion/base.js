import Ember from 'ember';
import {track, trackActions} from '../../utils/discussion-tracker';
import request from 'ember-ajax/request';

export default Ember.Object.extend({
	error: null,
	errorCodes: {
		notFound: '404'
	},
	errorClass: 'discussion-error-page',
	data: null,
	/*
	 * Set minorError to true, when you don't want to display error message e.g.:
	 * 404 on infinite scroll, when unable to load non-existing pages
	 * 404 on "view older replies" button, when unable to load non-existing or deleted replies
	 */
	minorError: false,
	pivotId: null,
	upvotingInProgress: {},
	wikiId: null,

	/**
	 * @returns {void}
	 */
	init() {
		const wikiId = Ember.get(Mercury, 'wiki.id');

		this.setProperties({
			data: Ember.Object.create({
				forumId: wikiId
			}),
			error: Ember.Object.create({}),
			wikiId
		});
	},

	/**
	 * @param {Object} err
	 *
	 * @returns {void}
	 */
	setErrorProperty(err) {
		if (err.errors[0].status === this.errorCodes.notFound) {
			this.set('error.isNotFound', true);
		}

		Ember.$('body').addClass(this.errorClass);
	},

	/**
	 * @param {Object} err
	 *
	 * @returns {void}
	 */
	handleLoadMoreError(err) {
		if (err.status === this.errorCodes.notFound) {
			this.set('data.minorError', true);
		} else {
			this.setErrorProperty(err);
		}
	},

	/**
	 * @param {string} errorMessage
	 *
	 * @returns {void}
	 */
	setFailedState(errorMessage) {
		this.set('data.dialogMessage', errorMessage);
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
	}
});
