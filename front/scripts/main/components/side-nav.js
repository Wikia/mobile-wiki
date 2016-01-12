import {track, trackActions} from '../../mercury/utils/track';

export default Ember.Component.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['shouldBeVisible:slide-into-view:collapsed'],

	isInSearchMode: false,
	searchQuery: '',
	searchPlaceholderLabel: Ember.computed(() => {
		return i18n.t('app.search-label');
	}),

	shouldBeVisibleObserver: Ember.observer('shouldBeVisible', function () {
		const trackLabel = this.get('shouldBeVisible') ? 'open' : 'close';

		track({
			action: trackActions.click,
			category: 'menu',
			label: trackLabel
		});
	}),

	/**
	 * Every time we exit search mode, regardless of if it was through the Cancel
	 * link or through clicking a search result, we want to clear out the query
	 * so that the search bar will clear.
	 */
	isInSearchModeObserver: Ember.observer('isInSearchMode', function () {
		if (!this.get('isInSearchMode')) {
			this.send('clearSearch');
		}
	}).on('didInsertElement'),

	actions: {
		/**
		 * @returns {void}
		 */
		clearSearch() {
			this.set('searchQuery', '');
		},

		/**
		 * @returns {void}
		 */
		collapse() {
			this.sendAction('toggleVisibility', false);
			this.send('searchCancel');
		},

		/**
		 * @returns {void}
		 */
		expand() {
			this.sendAction('toggleVisibility', true);
		},

		/**
		 * @returns {void}
		 */
		searchCancel() {
			this.set('isInSearchMode', false);
			this.send('clearSearch');
		},

		/**
		 * @returns {void}
		 */
		searchFocus() {
			this.set('isInSearchMode', true);
			// Track when search is opened
			track({
				action: trackActions.click,
				category: 'search',
			});
		},

		/**
		 * @returns {void}
		 */
		loadRandomArticle() {
			this.sendAction('loadRandomArticle');
		},

		/**
		 * Handler for enter in search box
		 *
		 * @param {string} [value=''] - input value
		 * @returns {void}
		 */
		enter(value) {
			// Use Oasis Search
			window.location.assign('%@Special:Search?search=%@&fulltext=Search'.fmt(Mercury.wiki.articlePath, value));
		},
	},
});
