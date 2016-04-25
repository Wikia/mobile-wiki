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
		 * @param {string} navName
		 * @returns {void}
		 */
		replaceNavigationContent(navName) {
			switch (navName) {
				case 'explore':
					this.set('currentNavContent', 'side-nav-explore-wikia-navigation');
					break;
				case 'local':
					this.set('currentNavContent', 'side-nav-local-navigation-root');
					break;
				case 'root':
					this.set('currentNavContent', 'side-nav-global-navigation-root');
					break;
				default:
					Ember.Logger.error(`Navigation content component: ${navName} doesn't exist`);
			}
		}
	}
});
