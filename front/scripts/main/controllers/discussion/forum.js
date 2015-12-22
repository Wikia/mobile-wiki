import DiscussionDeleteControllerMixin from '../../mixins/discussion-delete-controller';
import DiscussionModalDialogControllerMixin from '../../mixins/discussion-modal-dialog-controller';

export default Ember.Controller.extend(DiscussionDeleteControllerMixin, DiscussionModalDialogControllerMixin, {
	application: Ember.inject.controller(),
	sortBy: null,

	smartBannerVisible: Ember.computed.oneWay('application.smartBannerVisible'),
	siteHeadPinned: Ember.computed.oneWay('application.siteHeadPinned'),

	// Whether the sort component is currently visible
	sortVisible: false,

	sortTypes: [
		{
			name: 'trending',
			messageKey: 'main.sort-by-trending'
		},
		{
			name: 'latest',
			messageKey: 'main.sort-by-latest'
		}
	],

	sortMessageKey: Ember.computed('sortBy', function () {
		const sortTypes = this.get('sortTypes'),
			filtered = sortTypes.filter((obj) => {
				return obj.name === this.get('sortBy');
			});

		return filtered.length ? filtered[0].messageKey : sortTypes[0].messageKey;
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		showSortComponent() {
			this.set('sortVisible', true);
		},

		/**
		 * @returns {void}
		 */
		hideSortComponent() {
			this.set('sortVisible', false);
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		retry() {
			this.get('target').send('retry');
		},

		/**
		 * Bubbles up to DiscussionForumRoute
		 *
		 * @returns {void}
		 */
		goToAllDiscussions() {
			this.get('target').send('goToAllDiscussions');
		},
	}
});
