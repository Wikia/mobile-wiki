import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['input-container'],
	isFocused: false,
	isLabelFloating: Ember.computed('isFocused', 'value', function () {
		return this.get('isFocused') || this.get('value');
	}),

	actions: {
		/**
		 * @returns {void}
		 */
		onBlur(event) {
			this.set('isFocused', false);
			this.get('onBlurHandler')(event);
		},

		/**
		 * @returns {void}
		 */
		onFocus(event) {
			this.set('isFocused', true);
			this.get('onFocusHandler')(event);
		}
	}
});
