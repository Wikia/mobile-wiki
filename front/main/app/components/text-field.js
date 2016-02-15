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
		onBlur() {
			this.set('isFocused', false);
		},

		/**
		 * @returns {void}
		 */
		onFocus() {
			this.set('isFocused', true);
		}
	}
});
