import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

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
		track({
			action: trackActions.click,
			category: 'wiki-nav',
			label: this.get('shouldBeVisible') ? 'open' : 'close'
		});
	}),

	currentUser: Ember.inject.service(),
	globalNavContent: 'side-nav-global-navigation-root',
	isFandomVisible: Ember.computed(() => Mercury.wiki.language.content === 'en'),
	wikiaHomepage: Ember.computed(function () {
		return this.get('isFandomVisible') ?
			'http://www.wikia.com/fandom' :
			Ember.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com');
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
		wordmarkClick() {
			track({
				action: trackActions.click,
				category: 'wiki-nav',
				label: 'wordmark',
			});
			this.send('collapse');
		},

		/**
		 * @returns {void}
		 */
		homeOfFandomClick() {
			track({
				action: trackActions.click,
				category: 'wiki-nav',
				label: 'home-of-fandom',
			});
			this.send('collapse');
		},

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
			this.set('globalNavContent', 'side-nav-global-navigation-root');
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
			// Use Wikia Search
			window.location.assign(`${Mercury.wiki.articlePath}Special:Search?search=${value}&fulltext=Search`);
		},

		replaceNavigationContent(navName) {
			if (navName === 'explore') {
				this.set('globalNavContent', 'side-nav-explore-wikia-navigation');
			} else if (navName === 'local') {
				this.set('globalNavContent', 'side-nav-local-navigation-root');
			} else if (navName === 'root') {
				this.set('globalNavContent', 'side-nav-global-navigation-root');
			}
		}
	},
});
