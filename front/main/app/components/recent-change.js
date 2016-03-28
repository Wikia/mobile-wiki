import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';
import {track, trackActions} from 'common/utils/track';

const trackCategory = 'recent-wiki-activity';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		classNames: ['recent-change'],
		classNameBindings: ['active'],
		currentUser: Ember.inject.service(),
		revisionUpvotes: Ember.inject.service(),
		active: Ember.computed('id', 'rc', function () {
			return this.get('id') === this.get('rc');
		}),
		upvotesCount: Ember.computed('revisionUpvotes.upvotes.@each.count', function() {
			return this.get('revisionUpvotes.upvotes').findBy('revisionId', this.get('model.newId')).upvotes.length;
		}),
		upvotesEnabled: Ember.get(Mercury, 'wiki.language.content') === 'en',
		userUpvoted: Ember.computed('revisionUpvotes.upvotes.@each.count', 'currentUser.userId', function () {
				const upvotes = this.get('model.upvotes'),
					userId = this.get('currentUser.userId');

			return upvotes && userId && upvotes.isAny('from_user', userId);
		}),
		hasDiff: Ember.computed.and('model.old_revid', 'model.revid'),
		showDiffLink: true,

		didReceiveAttrs() {
			this.get('revisionUpvotes').addVote(this.get('model.newId'), this.get('model.upvotes'));
		},

		handleError(label) {
			this.trackError(label);
			this.get('showError')('main.error');
		},

		/**
		 * Sends impression success tracking for recent-wiki-activity category
		 * @param {string} label
		 * @returns {void}
		 */
		trackSuccess(label) {
			track({
				action: trackActions.success,
				category: trackCategory,
				label
			});
		},

		/**
		 * Sends impression error tracking for recent-wiki-activity category
		 * @param {string} label
		 * @returns {void}
		 */
		trackError(label) {
			track({
				action: trackActions.error,
				category: trackCategory,
				label
			});
		},

		actions: {
			handleVote(revisionId, title) {
				if (this.get('userUpvoted')) {
					// TODO this.removeUpvote(this.get('currentUserUpvoteId'));
				} else {
					this.get('upvote')(revisionId, title, this.get('currentUser.userId')).then(
						this.trackSuccess.bind(this, 'upvote-icon-success'),
						this.handleError.bind(this, 'upvote-icon-error')
					);
					this.trackClick(trackCategory, 'upvote-icon');
				}
			}
		}
	}
);
