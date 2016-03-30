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
		currentUpvotes: null,
		upvotesCount: Ember.computed('revisionUpvotes.upvotes.@each.count', function () {
			return this.get('currentUpvotes').count || 0;
		}),
		upvotesEnabled: Ember.get(Mercury, 'wiki.language.content') === 'en',
		currentUserUpvoteId: Ember.computed('upvotesCount', 'currentUser.userId', function () {
			return this.get('currentUpvotes').userUpvoteId || 0;
		}),
		hasDiff: Ember.computed.and('model.old_revid', 'model.revid'),
		showDiffLink: true,

		init() {
			this._super(...arguments);
			const currentUpvotes = this.get('revisionUpvotes.upvotes').findBy('revisionId', this.get('revisionId')) || [];

			this.set('currentUpvotes', currentUpvotes);
		},

		addUpvote() {
			this.get('revisionUpvotes').upvote(this.get('revisionId'), this.get('model.title')).then(
				() => this.trackSuccess('upvote-icon-success'),
				() => this.handleError('upvote-icon-error')
			);
			this.trackClick(trackCategory, 'upvote-icon');
		},

		removeUpvote() {
			this.get('revisionUpvotes').removeUpvote(
				this.get('revisionId'),
				this.get('currentUserUpvoteId'),
				this.get('model.title'),
				this.get('model.userId')
			).then(
				() => this.trackSuccess('remove-upvote-success'),
				() => this.handleError('remove-upvote-error')
			);
			this.trackClick(trackCategory, 'remove-upvote-icon');
		},

		handleError(label) {
			this.trackError(label);
			this.get('showError')('main.error');
		},

		trackSuccess(label) {
			track({
				action: trackActions.success,
				category: trackCategory,
				label
			});
		},

		trackError(label) {
			track({
				action: trackActions.error,
				category: trackCategory,
				label
			});
		},

		actions: {
			handleVote() {
				if (this.get('currentUserUpvoteId')) {
					this.removeUpvote();
				} else {
					this.addUpvote();
				}
			}
		}
	}
);
