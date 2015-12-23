import Ember from 'ember';
import ThemeMixin from './theme';

/**
 * Sets what is needed for UI on each route on Discussions
 */
export default Ember.Mixin.create(ThemeMixin, {

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
