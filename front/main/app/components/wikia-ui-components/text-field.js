/**
 * Text-field reusable component usage:
 *
 * @example
 * {{wikia-ui-components/text-field
 *      value='example value'
 *      inputId='userName'
 *      name='userName'
 *      label='User name'
 *      class='additional-custom-class'
 *      onFocusHandler=onFocusHandlerAction
 *      onBlurHandler=onBlurHandlerAction
 *      placeholder='placeholder text'
 * }}
 *
 * @example with error message
 * {{wikia-ui-components/text-field
 *      value='example value'
 *      inputId='userName'
 *      name='userName'
 *      label='User name'
 *      onFocusHandler=onFocusHandlerAction
 *      onBlurHandler=onBlurHandlerAction
 *      errorMessage='this value is required'
 * }}
 */
import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['text-field'],
	classNameBindings: ['isInvalid:text-field--invalid'],
	isFocused: false,
	isLabelFloating: Ember.computed('isFocused', 'value', function () {
		return this.get('isFocused') || !Ember.isEmpty(this.get('value'));
	}),
	labelClassNames: Ember.computed('isLabelFloating', function () {
		const classNames = ['text-field-label'];

		if (this.get('isLabelFloating')) {
			classNames.push('text-field-label--floating');
		}

		return classNames.join(' ');
	}),
	isInvalid: Ember.computed.bool('errorMessage'),

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
		},

		/**
		 * @param {String} value
		 * @param {Event} event
		 */
		onKeyUp: function(value, event) {
			const onKeyUpHandler = this.get('onKeyUpHandler');

			if (typeof onKeyUpHandler === 'function') {
				onKeyUpHandler(event);
			}
		}
	}
});
