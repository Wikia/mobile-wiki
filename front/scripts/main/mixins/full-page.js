import App from '../app';

// This mixin should be considered temporary, until a
// better solution is created with Jira ticket XW-247
export default App.FullPageMixin = Ember.Mixin.create({
	/**
	 * @returns {void}
	 */
	activate() {
		this.controllerFor('application').set('fullPage', true);
	},

	/**
	 * @returns {void}
	 */
	deactivate() {
		this.controllerFor('application').set('fullPage', false);
	}
});
