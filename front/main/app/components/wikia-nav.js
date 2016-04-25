import Ember from 'ember';

export default Ember.Component.extend({
	defaultNavContent: 'side-nav-global-navigation-root',

	init() {
		this._super(...arguments);

		this.currentNavContent = this.get('defaultNavContent');
	},

	willDestroyElement() {
		this._super(...arguments);

		// reset current nav content to its default state
		this.set('globalNavContent', this.get('defaultNavContent'));
	},

	actions: {
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
				this.set('currentNavContent', 'side-nav-explore-wikia-navigation');
			} else if (navName === 'local') {
				this.set('currentNavContent', 'side-nav-local-navigation-root');
			} else if (navName === 'root') {
				this.set('currentNavContent', 'side-nav-global-navigation-root');
			}
		}
	}
});
