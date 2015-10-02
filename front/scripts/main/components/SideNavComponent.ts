/// <reference path="../app.ts" />
'use strict';

App.SideNavComponent = Em.Component.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['shouldBeVisible:slide-into-view:collapsed'],

	isInSearchMode: false,
	searchQuery: '',
	searchPlaceholderLabel: Em.computed(function (): string {
		return i18n.t('app.search-label');
	}),

	actions: {
		clearSearch(): void {
			this.set('searchQuery', '');
		},

		collapse(): void {
			this.sendAction('toggleVisibility', false);
			this.send('searchCancel');
		},

		expand(): void {
			this.sendAction('toggleVisibility', true);
		},

		searchCancel(): void {
			this.set('isInSearchMode', false);
			this.send('clearSearch');
		},

		searchFocus(): void {
			this.set('isInSearchMode', true);
			// Track when search is opened
			M.track({
				action: M.trackActions.click,
				category: 'search'
			});
		},

		loadRandomArticle(): void {
			this.sendAction('loadRandomArticle');
		},

		/**
		 * @desc Handler for enter in search box
		 *
		 * Running A/B test to switch between using MediaWiki Special:Search and Google Custom Search
		 *
		 * @param value of input
		 */
		enter(value = ''): void {
			// Experiment id from Optimizely
			var experimentIds = {
					prod: '3571301500',
					dev: '3579160288'
				},
				variationNumber = Mercury.Utils.VariantTesting.getExperimentVariationNumber(experimentIds);

			if (variationNumber === 2) {
				// Use Google Search
				// Hide SideNav
				this.sendAction('toggleVisibility', false);
				this.send('searchCancel');

				this.sendAction('search', value);
			} else {
				// Use Wikia Search
				window.location.assign('%@Special:Search?search=%@&fulltext=Search'.fmt(Mercury.wiki.articlePath, value));
			}
		}
	},

	shouldBeVisibleObserver: Em.observer('shouldBeVisible', function () {
		var trackLabel: string = this.get('shouldBeVisible') ? 'open' : 'close';
		M.track({
			action: M.trackActions.click,
			category: 'menu',
			label: trackLabel
		});
	}),

	/**
	 * Every time we exit search mode, regardless of if it was through the Cancel
	 * link or through clicking a search result, we want to clear out the query
	 * so that the search bar will clear.
	 */
	isInSearchModeObserver: Em.observer('isInSearchMode', function () {
		if (!this.get('isInSearchMode')) {
			this.send('clearSearch');
		}
	}).on('didInsertElement')
});
