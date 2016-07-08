import Ember from 'ember';
import HeadroomMixin from '../mixins/headroom';

export default Ember.Component.extend(
	HeadroomMixin,
	{
		headroomOptions: {
			classes: {
				initial: 'discussion-headroom',
				pinned: 'discussion-headroom-pinned',
				unpinned: 'discussion-headroom-un-pinned',
				top: 'discussion-headroom-top',
				notTop: 'discussion-headroom-not-top'
			}
		},

		backToDiscussionsLinkTitle: i18n.t('main.back-to-discussions-link', {ns: 'discussion'}),

		canDeleteAll: false,

		classNames: ['discussion-header-wrapper'],
		classNameBindings: ['isFandomBarHidden:discussion-header-margin'],

		isFandomBarHidden: Ember.computed(() => Ember.get(Mercury, 'wiki.language.content') !== 'en'),

		discussionSort: Ember.inject.service(),
		isFilterApplied: Ember.computed('discussionSort.sortTypes.@each.active', 'categories.@each.selected', function () {
			return this.get('discussionSort.sortTypes.0.active') === false ||
				!this.get('categories').isEvery('selected', false) ||
				this.get('discussionSort.onlyReported', true);
		}),

		siteName: Ember.computed(() => {
			return Ember.get(Mercury, 'wiki.siteName');
		}),
	}
);
