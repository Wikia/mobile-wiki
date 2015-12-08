import App from '../app';
import ThemeMixin from './theme';

/**
 * Sets what is needed for UI on each route on Discussions
 */
export default App.DiscussionLayoutMixin = Ember.Mixin.create(ThemeMixin, {

	/**
	 * @returns {void}
	 */
	activate() {
		Ember.$('body').addClass('discussions');
		this._super();
	},

	/**
	 * @returns {void}
	 */
	deactivate() {
		Ember.$('body').removeClass('discussions');
		this._super();
	},
});
