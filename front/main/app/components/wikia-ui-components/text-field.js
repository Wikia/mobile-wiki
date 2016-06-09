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
 *      onEnterHandler=onEnterAction
 *      onFocusHandler=onFocusHandlerAction
 *      onBlurHandler=onBlurHandlerAction
 *      onKeyUpHandler=onKeyUpHandler
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
 *      onKeyUpHandler=onKeyUpHandler
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
	type: 'text',

	init() {
		// input shouldn't be reloaded on change, it's needed for jap/zh os tools
		this.set('valueProxy', this.get('value'));
		this._super(...arguments);
	},

	actions: {
		/**
		 * @param {jQuery.Event} event
		 * @returns {void}
		 */
		onBlur(event) {
			const onBlurHandler = this.get('onBlurHandler');

			this.set('isFocused', false);

			if (onBlurHandler) {
				onBlurHandler(event);
			}
		},

		/**
		 * @param {jQuery.Event} event
		 * @returns {void}
		 */
		onEnter(event) {
			const onEnterHandler = this.get('onEnterHandler');

			if (onEnterHandler) {
				onEnterHandler(event);
			}
		},

		/**
		 * @param {jQuery.Event} event
		 * @returns {void}
		 */
		onFocus(event) {
			const onFocusHandler = this.get('onFocusHandler');

			this.set('isFocused', true);

			if (onFocusHandler) {
				onFocusHandler(event);
			}
		},

		/**
		 * @param {String} value
		 * @param {Event} event
		 * @returns {void}
		 */
		onKeyUp(value, event) {
			const onKeyUpHandler = this.get('onKeyUpHandler');

			this.set('value', value);

			if (onKeyUpHandler) {
				onKeyUpHandler(event);
			}
		}
	}
});
