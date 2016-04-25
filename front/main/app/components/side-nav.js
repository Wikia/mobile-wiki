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
				this.set('globalNavContent', 'side-nav-global-navigation-root');
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
				this.set('globalNavContent', 'side-nav-global-navigation-root');
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
	}
);
