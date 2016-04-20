import Ember from 'ember';
import {track, trackActions} from 'common/utils/track';

export default Ember.Component.extend(
	{
		tagName: 'nav',
		classNames: ['side-nav'],
		classNameBindings: ['shouldBeVisible:slide-into-view:collapsed'],
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
					category: 'side-nav',
					label: 'open-wikia-link'
				});
				this.send('collapse');
			},

			/**
			 * @returns {void}
			 */
			homeOfFandomClick() {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: 'open-home-of-fandom'
				});
			},

			/**
			 * @returns {void}
			 */
			collapse() {
				// this.set('globalNavContent', 'side-nav-global-navigation-root');

				// temporary change for nav entry points AB test - https://wikia-inc.atlassian.net/browse/DAT-4052
				// TODO: cleanup as a part of https://wikia-inc.atlassian.net/browse/DAT-4064
				this.setProperties({
					globalNavContent: this.setNavContentForExperiment(),
					shouldOpenNavSearch: false
				});

				this.sendAction('toggleVisibility', false);
			},

			closeButtonClick() {
				track({
					action: trackActions.click,
					category: 'side-nav',
					label: 'collapsed'
				});
				this.send('collapse');
			},

			/**
			 * @returns {void}
			 */
			loadRandomArticle() {
				// this.set('globalNavContent', 'side-nav-global-navigation-root');

				// temporary change for nav entry points AB test - https://wikia-inc.atlassian.net/browse/DAT-4052
				// TODO: cleanup as a part of https://wikia-inc.atlassian.net/browse/DAT-4064
				this.setProperties({
					globalNavContent: this.setNavContentForExperiment(),
					shouldOpenNavSearch: false
				});
				this.sendAction('loadRandomArticle');
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

		// temporary change for nav entry points AB test - https://wikia-inc.atlassian.net/browse/DAT-4052
		// TODO: cleanup as a part of https://wikia-inc.atlassian.net/browse/DAT-4064
		hideLocalNav: Ember.computed.bool('shouldOpenNavSearch'),
		setNavContent: Ember.observer('shouldOpenNavSearch', function () {
			this.set('globalNavContent', this.setNavContentForExperiment());
		}),
		/**
		 * @returns {string}
		 */
		setNavContentForExperiment() {
			const navType = this.get('shouldOpenNavSearch') ? 'local' : 'global';

			return `side-nav-${navType}-navigation-root`;
		}
	}
);
