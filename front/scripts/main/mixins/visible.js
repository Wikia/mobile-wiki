import App from '../app';
import VisibilityStateManager from './visibility-state-manager';

/**
 * Mixin that sends 'onVisible' action when element appears on screen for the first time.
 *
 */

export default App.VisibleMixin = Ember.Mixin.create({
	/**
	 * @returns {void}
	 */
	init() {
		this._super();

		VisibilityStateManager.add(this);
	}
});
