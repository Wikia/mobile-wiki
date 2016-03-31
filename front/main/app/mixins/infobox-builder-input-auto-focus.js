import Ember from 'ember';

export default Ember.Mixin.create({
	/**
	 * We should never change properties on components during
	 * didRender because it causes significant performance degradation.
	 * @returns {void}
	 */
	didRender() {
		this._super(...arguments);
		Ember.run.scheduleOnce('afterRender', this, 'focusFirstInput');
	},

	/**
	 * Focuses on the end of the first text input element of this component
	 * @returns {void}
	 */
	focusFirstInput() {
		const $firstInput = this.$('.text-field-input').get(0);

		if ($firstInput) {
			$firstInput.focus();
			// required for moving cursor to the end of input on FF
			$firstInput.selectionStart = $firstInput.selectionEnd = $firstInput.value.length;
		}
	}
});
