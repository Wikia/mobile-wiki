import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend({
	tagName: 'nav',
	classNames: ['side-nav'],
	classNameBindings: ['shouldBeVisible:slide-into-view:collapsed'],

	shouldBeVisibleObserver: Ember.observer('shouldBeVisible', function () {
		track({
			action: trackActions.click,
			category: 'wiki-nav',
			label: this.get('shouldBeVisible') ? 'open' : 'close'
		});
	}),

	globalNavContent: 'side-nav-global-navigation-root',
	isFandomVisible: Ember.computed(() => Mercury.wiki.language.content === 'en'),
	wikiaHomepage: Ember.getWithDefault(Mercury, 'wiki.homepage', 'http://www.wikia.com'),
	homeOfFandomLabel: Ember.get(Mercury, 'wiki.navigation2016.fandomLabel'),

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
				label: 'open-home-of-fandom',
			});
			this.send('collapse');
		},

		/**
		 * @returns {void}
		 */
		collapse() {
			this.set('globalNavContent', 'side-nav-global-navigation-root');
			this.sendAction('toggleVisibility', false);
		},

		/**
		 * @returns {void}
		 */
		loadRandomArticle() {
			this.set('globalNavContent', 'side-nav-global-navigation-root');
			this.sendAction('loadRandomArticle');
		},

		replaceNavigationContent(navName) {
			if (navName === 'explore') {
				track({
					action: trackActions.click,
					category: 'wiki-nav',
					label: 'menu-show-explore-wikia'
				});
				this.set('globalNavContent', 'side-nav-explore-wikia-navigation');
			} else if (navName === 'local') {
				track({
					action: trackActions.click,
					category: 'wiki-nav',
					label: 'menu-show-local-navigation'
				});
				this.set('globalNavContent', 'side-nav-local-navigation-root');
			} else if (navName === 'root') {
				this.set('globalNavContent', 'side-nav-global-navigation-root');
			}
		}
	},
});
