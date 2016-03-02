import Ember from 'ember';
import TrackClickMixin from '../mixins/track-click';

export default Ember.Component.extend(
	TrackClickMixin,
	{
		tagName: 'nav',
		classNames: ['side-nav'],
		classNameBindings: ['shouldBeVisible:slide-into-view:collapsed'],

		shouldBeVisibleObserver: Ember.observer('shouldBeVisible', function () {
			this.trackClick('side-nav', this.get('shouldBeVisible') ? 'expanded' : 'collapsed');
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
				this.trackClick('side-nav', 'open-wordmark-link');
				this.send('collapse');
			},

			/**
			 * @returns {void}
			 */
			homeOfFandomClick() {
				this.trackClick('side-nav', 'open-home-of-fandom');
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
					this.trackClick('side-nav', 'menu-show-explore-wikia');
					this.set('globalNavContent', 'side-nav-explore-wikia-navigation');
				} else if (navName === 'local') {
					this.trackClick('side-nav', 'menu-show-local-navigation');
					this.set('globalNavContent', 'side-nav-local-navigation-root');
				} else if (navName === 'root') {
					this.set('globalNavContent', 'side-nav-global-navigation-root');
				}
			}
		},
	}
);
