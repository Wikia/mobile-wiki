/**
 * Text-fiels reusable component usage:
 *
 * @example
 * {{wikia-ui-components/text-field
 *      value='example value'
 *      inputId='userName'
 *      name='userName'
 *      label='User name'
 *      class='additional-custom-cass'
 *      onFocusHandler=onFocusHandlerFunction
 *      onBlurHandler=onBlurHandlerFunction
 * }}
 */
import Ember from 'ember';

export default Ember.Component.extend({
	classNames: ['text-field'],
	isFocused: false,
	isLabelFloating: Ember.computed('isFocused', 'value', function () {
		return this.get('isFocused') || this.get('value') !== '';
	}),
	labelClassNames: Ember.computed('isLabelFloating', function () {
		const classNames = ['text-field-label'];

		if (this.get('isLabelFloating')) {
			classNames.push('text-field-label--floating');
		}

		return classNames.join(' ');
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
