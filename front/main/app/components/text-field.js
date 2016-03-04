import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['input-container'],
	isFocused: false,
	isLabelFloating: Ember.computed('isFocused', 'value', function () {
		return this.get('isFocused') || this.get('value');
	}),

	actions: {
		/**
		 * @param {jQuery.Event} event
		 * @returns {void}
		 */
		onBlur(event) {
			const onBlurHandler = this.get('onBlurHandler');

			this.set('isFocused', false);

			if (typeof onBlurHandler === 'function') {
				onBlurHandler(event);
			}
		},

		/**
		 * @param {jQuery.Event} event
		 * @returns {void}
		 */
		onFocus(event) {
			const onFocusHandler = this.get('onFocusHandler');

			this.set('isFocused', true);

			if (typeof onFocusHandler === 'function') {
				onFocusHandler(event);
			}
		}
	}
});
